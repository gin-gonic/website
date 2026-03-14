---
title: "Session Management"
sidebar:
  order: 9
---

Sessions allow you to store user-specific data across multiple HTTP requests. Since HTTP is stateless, sessions use cookies or other mechanisms to identify returning users and retrieve their stored data.

## Using gin-contrib/sessions

The [gin-contrib/sessions](https://github.com/gin-contrib/sessions) middleware provides session management with multiple backend stores:

```sh
go get github.com/gin-contrib/sessions
```

### Cookie-based sessions

The simplest approach stores session data in encrypted cookies:

```go
package main

import (
  "net/http"

  "github.com/gin-contrib/sessions"
  "github.com/gin-contrib/sessions/cookie"
  "github.com/gin-gonic/gin"
)

func main() {
  r := gin.Default()

  // Create cookie-based session store with a secret key
  store := cookie.NewStore([]byte("your-secret-key"))
  r.Use(sessions.Sessions("mysession", store))

  r.GET("/login", func(c *gin.Context) {
    session := sessions.Default(c)
    session.Set("user", "john")
    session.Save()
    c.JSON(http.StatusOK, gin.H{"message": "logged in"})
  })

  r.GET("/profile", func(c *gin.Context) {
    session := sessions.Default(c)
    user := session.Get("user")
    if user == nil {
      c.JSON(http.StatusUnauthorized, gin.H{"error": "not logged in"})
      return
    }
    c.JSON(http.StatusOK, gin.H{"user": user})
  })

  r.GET("/logout", func(c *gin.Context) {
    session := sessions.Default(c)
    session.Clear()
    session.Save()
    c.JSON(http.StatusOK, gin.H{"message": "logged out"})
  })

  r.Run(":8080")
}
```

### Redis-based sessions

For production applications, store sessions in Redis for scalability across multiple instances:

```go
package main

import (
  "net/http"

  "github.com/gin-contrib/sessions"
  "github.com/gin-contrib/sessions/redis"
  "github.com/gin-gonic/gin"
)

func main() {
  r := gin.Default()

  // Connect to Redis for session storage
  store, err := redis.NewStore(10, "tcp", "localhost:6379", "", []byte("secret"))
  if err != nil {
    panic(err)
  }
  r.Use(sessions.Sessions("mysession", store))

  r.GET("/set", func(c *gin.Context) {
    session := sessions.Default(c)
    session.Set("count", 1)
    session.Save()
    c.JSON(http.StatusOK, gin.H{"count": 1})
  })

  r.GET("/get", func(c *gin.Context) {
    session := sessions.Default(c)
    count := session.Get("count")
    c.JSON(http.StatusOK, gin.H{"count": count})
  })

  r.Run(":8080")
}
```

## Session options

Configure session behavior with `sessions.Options`:

```go
session := sessions.Default(c)
session.Options(sessions.Options{
  Path:     "/",
  MaxAge:   3600,        // Session expires in 1 hour (seconds)
  HttpOnly: true,        // Prevent JavaScript access
  Secure:   true,        // Only send over HTTPS
  SameSite: http.SameSiteLaxMode,
})
```

| Option | Description |
|--------|-------------|
| `Path` | Cookie path scope (default: `/`) |
| `MaxAge` | Lifetime in seconds. Use `-1` to delete, `0` for browser session |
| `HttpOnly` | Prevents JavaScript access to the cookie |
| `Secure` | Only send cookie over HTTPS |
| `SameSite` | Controls cross-site cookie behavior (`Lax`, `Strict`, `None`) |

:::note
Always set `HttpOnly: true` and `Secure: true` in production to protect session cookies from XSS and man-in-the-middle attacks.
:::

## Available backends

| Backend | Package | Use case |
|---------|---------|----------|
| Cookie | `sessions/cookie` | Simple apps, small session data |
| Redis | `sessions/redis` | Production, multi-instance deployments |
| Memcached | `sessions/memcached` | High-performance caching layer |
| MongoDB | `sessions/mongo` | When MongoDB is your primary datastore |
| PostgreSQL | `sessions/postgres` | When PostgreSQL is your primary datastore |

## Sessions vs JWT

| Aspect | Sessions | JWT |
|--------|----------|-----|
| Storage | Server-side (Redis, DB) | Client-side (token) |
| Revocation | Easy (delete from store) | Difficult (requires blocklist) |
| Scalability | Needs shared store | Stateless |
| Data size | Unlimited server-side | Limited by token size |

Use sessions when you need easy revocation (e.g., logout, ban user). Use JWT when you need stateless authentication across microservices.

## See also

- [Cookie handling](/en/docs/server-config/cookie/)
- [Security best practices](/en/docs/middleware/security-guide/)
- [Using middleware](/en/docs/middleware/using-middleware/)
