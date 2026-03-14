---
title: "Security Best Practices"
sidebar:
  order: 8
---

Web applications are a primary target for attackers. A Gin application that handles user input, stores data, or runs behind a reverse proxy needs deliberate security configuration before it goes to production. This guide covers the most important defenses and shows how to apply each one with Gin middleware and standard Go libraries.

:::note
Security is layered. No single technique on this list is sufficient on its own. Apply all of the relevant sections to build defense in depth.
:::

## CORS configuration

Cross-Origin Resource Sharing (CORS) controls which external domains can make requests to your API. Misconfigured CORS can allow malicious websites to read responses from your server on behalf of authenticated users.

Use the [`gin-contrib/cors`](https://github.com/gin-contrib/cors) package for a well-tested solution.

```go
package main

import (
  "time"

  "github.com/gin-contrib/cors"
  "github.com/gin-gonic/gin"
)

func main() {
  r := gin.Default()

  r.Use(cors.New(cors.Config{
    AllowOrigins:     []string{"https://example.com"},
    AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
    AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
    ExposeHeaders:    []string{"Content-Length"},
    AllowCredentials: true,
    MaxAge:           12 * time.Hour,
  }))

  r.GET("/api/data", func(c *gin.Context) {
    c.JSON(200, gin.H{"message": "ok"})
  })

  r.Run()
}
```

:::note
Never use `AllowOrigins: []string{"*"}` together with `AllowCredentials: true`. This tells browsers that any site can make authenticated requests to your API.
:::

## CSRF protection

Cross-Site Request Forgery tricks an authenticated user's browser into sending unwanted requests to your application. Any state-changing endpoint (POST, PUT, DELETE) that relies on cookies for authentication needs CSRF protection.

Use the [`gin-contrib/csrf`](https://github.com/gin-contrib/csrf) middleware to add token-based protection.

```go
package main

import (
  "github.com/gin-contrib/csrf"
  "github.com/gin-contrib/sessions"
  "github.com/gin-contrib/sessions/cookie"
  "github.com/gin-gonic/gin"
)

func main() {
  r := gin.Default()

  store := cookie.NewStore([]byte("session-secret"))
  r.Use(sessions.Sessions("mysession", store))

  r.Use(csrf.Middleware(csrf.Options{
    Secret: "csrf-token-secret",
    ErrorFunc: func(c *gin.Context) {
      c.String(403, "CSRF token mismatch")
      c.Abort()
    },
  }))

  r.GET("/form", func(c *gin.Context) {
    token := csrf.GetToken(c)
    c.JSON(200, gin.H{"csrf_token": token})
  })

  r.POST("/form", func(c *gin.Context) {
    c.JSON(200, gin.H{"message": "submitted"})
  })

  r.Run()
}
```

:::note
CSRF protection is critical for applications that use cookie-based authentication. APIs that rely solely on `Authorization` headers (e.g., Bearer tokens) are not vulnerable to CSRF because browsers do not attach those headers automatically.
:::

## Rate limiting

Rate limiting prevents abuse, brute-force attacks, and resource exhaustion. You can use the standard library's `golang.org/x/time/rate` package to build a simple per-client rate limiter as middleware.

```go
package main

import (
  "net/http"
  "sync"

  "github.com/gin-gonic/gin"
  "golang.org/x/time/rate"
)

func RateLimiter() gin.HandlerFunc {
  type client struct {
    limiter *rate.Limiter
  }

  var (
    mu      sync.Mutex
    clients = make(map[string]*client)
  )

  return func(c *gin.Context) {
    ip := c.ClientIP()

    mu.Lock()
    if _, exists := clients[ip]; !exists {
      // Allow 10 requests per second with a burst of 20
      clients[ip] = &client{limiter: rate.NewLimiter(10, 20)}
    }
    cl := clients[ip]
    mu.Unlock()

    if !cl.limiter.Allow() {
      c.AbortWithStatusJSON(http.StatusTooManyRequests, gin.H{
        "error": "rate limit exceeded",
      })
      return
    }

    c.Next()
  }
}

func main() {
  r := gin.Default()
  r.Use(RateLimiter())

  r.GET("/api/resource", func(c *gin.Context) {
    c.JSON(200, gin.H{"message": "ok"})
  })

  r.Run()
}
```

:::note
The example above stores limiters in an in-memory map. In production, you should add periodic cleanup of stale entries and consider a distributed rate limiter (e.g., Redis-backed) if you run multiple application instances.
:::

## Input validation and SQL injection prevention

Always validate and bind input using Gin's model binding with struct tags. Never construct SQL queries by concatenating user input.

### Validate input with struct tags

```go
type CreateUser struct {
  Username string `json:"username" binding:"required,alphanum,min=3,max=30"`
  Email    string `json:"email"    binding:"required,email"`
  Age      int    `json:"age"      binding:"required,gte=1,lte=130"`
}

func createUserHandler(c *gin.Context) {
  var req CreateUser
  if err := c.ShouldBindJSON(&req); err != nil {
    c.JSON(400, gin.H{"error": err.Error()})
    return
  }
  // req is now validated; proceed safely
}
```

### Use parameterized queries

```go
// DANGEROUS -- SQL injection vulnerability
row := db.QueryRow("SELECT id FROM users WHERE username = '" + username + "'")

// SAFE -- parameterized query
row := db.QueryRow("SELECT id FROM users WHERE username = $1", username)
```

This applies to every database library. Whether you use `database/sql`, GORM, sqlx, or another ORM, always use parameter placeholders and never string concatenation.

:::note
Input validation and parameterized queries are your two most important defenses against injection attacks. Neither one alone is sufficient -- use both.
:::

## XSS prevention

Cross-Site Scripting (XSS) occurs when an attacker injects malicious scripts that execute in other users' browsers. Defend against this at multiple layers.

### Escape HTML output

When rendering HTML templates, Go's `html/template` package escapes output by default. If you return user-supplied data as JSON, make sure the `Content-Type` header is set correctly so browsers do not interpret JSON as HTML.

```go
// Gin sets Content-Type automatically for JSON responses.
// Use c.JSON, not c.String, when returning structured data.
c.JSON(200, gin.H{"input": userInput})
```

### Use SecureJSON for JSONP protection

Gin provides `c.SecureJSON` which prepends `while(1);` to prevent JSON hijacking.

```go
c.SecureJSON(200, gin.H{"data": userInput})
```

### Set Content-Type explicitly when needed

```go
// For API endpoints, always return JSON
c.Header("Content-Type", "application/json; charset=utf-8")
c.Header("X-Content-Type-Options", "nosniff")
```

The `X-Content-Type-Options: nosniff` header prevents browsers from MIME-type sniffing, which stops them from interpreting a response as HTML when the server declares it as something else.

## Security headers middleware

Adding security headers is one of the simplest and most effective hardening steps. See the full [Security Headers](/en/docs/middleware/security-headers/) page for a detailed example. Below is a quick summary of the essential headers.

```go
func SecurityHeaders() gin.HandlerFunc {
  return func(c *gin.Context) {
    c.Header("X-Frame-Options", "DENY")
    c.Header("X-Content-Type-Options", "nosniff")
    c.Header("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
    c.Header("Content-Security-Policy", "default-src 'self'")
    c.Header("Referrer-Policy", "strict-origin")
    c.Header("Permissions-Policy", "geolocation=(), camera=(), microphone=()")
    c.Next()
  }
}
```

| Header | What it prevents |
|--------|-----------------|
| `X-Frame-Options: DENY` | Clickjacking via iframes |
| `X-Content-Type-Options: nosniff` | MIME-type sniffing attacks |
| `Strict-Transport-Security` | Protocol downgrade and cookie hijacking |
| `Content-Security-Policy` | XSS and data injection |
| `Referrer-Policy` | Leaking sensitive URL parameters to third parties |
| `Permissions-Policy` | Unauthorized use of browser APIs (camera, mic, etc.) |

## Trusted proxies

When your application runs behind a reverse proxy or load balancer, you must tell Gin which proxies to trust. Without this configuration, attackers can forge the `X-Forwarded-For` header to bypass IP-based access controls and rate limiting.

```go
// Trust only your known proxy addresses
router.SetTrustedProxies([]string{"10.0.0.1", "192.168.1.0/24"})
```

See the [Trusted Proxies](/en/docs/server-config/trusted-proxies/) page for a full explanation and configuration options.

## HTTPS and TLS

All production Gin applications should serve traffic over HTTPS. Gin supports automatic TLS certificates via Let's Encrypt.

```go
import "github.com/gin-gonic/autotls"

func main() {
  r := gin.Default()
  // ... routes ...
  log.Fatal(autotls.Run(r, "example.com"))
}
```

See the [Support Let's Encrypt](/en/docs/server-config/support-lets-encrypt/) page for complete setup instructions including custom certificate managers.

:::note
Always combine HTTPS with the `Strict-Transport-Security` header (HSTS) to prevent protocol downgrade attacks. Once the HSTS header is set, browsers will refuse to connect over plain HTTP.
:::

## See also

- [Security Headers](/en/docs/middleware/security-headers/)
- [Trusted Proxies](/en/docs/server-config/trusted-proxies/)
- [Support Let's Encrypt](/en/docs/server-config/support-lets-encrypt/)
- [Custom Middleware](/en/docs/middleware/custom-middleware/)
- [Binding and Validation](/en/docs/binding/binding-and-validation/)
