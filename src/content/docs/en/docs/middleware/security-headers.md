---
title: "Security Headers"
sidebar:
  order: 7
---

It's important to use security headers to protect your web application from common security vulnerabilities. This example shows you how to add security headers to your Gin application and also how to avoid Host Header Injection related attacks (SSRF, Open Redirection).

### What each header protects against

| Header | Purpose |
|--------|---------|
| `X-Content-Type-Options: nosniff` | Prevents MIME-type sniffing attacks. Without this header, browsers may interpret files as a different content type than declared, allowing attackers to execute malicious scripts disguised as harmless file types (e.g., uploading a `.jpg` that is actually JavaScript). |
| `X-Frame-Options: DENY` | Prevents clickjacking by disabling the page from being loaded inside an `<iframe>`. Attackers use clickjacking to overlay invisible frames on legitimate pages, tricking users into clicking hidden buttons (e.g., "Delete my account"). |
| `Content-Security-Policy` | Controls which resources (scripts, styles, images, fonts, etc.) the browser is allowed to load and from which origins. This is one of the most effective defenses against Cross-Site Scripting (XSS) because it can block inline scripts and restrict script sources. |
| `X-XSS-Protection: 1; mode=block` | Activates the browser's built-in XSS filter. This header is largely deprecated in modern browsers (Chrome removed its XSS Auditor in 2019), but it still provides defense-in-depth for users on older browsers. |
| `Strict-Transport-Security` | Forces the browser to use HTTPS for all future requests to the domain for the specified `max-age` duration. This prevents protocol downgrade attacks and cookie hijacking over insecure HTTP connections. The `includeSubDomains` directive extends this protection to all subdomains. |
| `Referrer-Policy: strict-origin` | Controls how much referrer information is sent with outgoing requests. Without this header, the full URL (including query parameters that may contain tokens or sensitive data) can leak to third-party sites. `strict-origin` sends only the origin (domain) and only over HTTPS. |
| `Permissions-Policy` | Restricts which browser features (geolocation, camera, microphone, etc.) can be used by the page. This limits the damage if an attacker manages to inject scripts, since those scripts cannot access sensitive device APIs. |

### Example

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  r := gin.Default()

  expectedHost := "localhost:8080"

  // Setup Security Headers
  r.Use(func(c *gin.Context) {
    if c.Request.Host != expectedHost {
      c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Invalid host header"})
      return
    }
    c.Header("X-Frame-Options", "DENY")
    c.Header("Content-Security-Policy", "default-src 'self'; connect-src *; font-src *; script-src-elem * 'unsafe-inline'; img-src * data:; style-src * 'unsafe-inline';")
    c.Header("X-XSS-Protection", "1; mode=block")
    c.Header("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
    c.Header("Referrer-Policy", "strict-origin")
    c.Header("X-Content-Type-Options", "nosniff")
    c.Header("Permissions-Policy", "geolocation=(),midi=(),sync-xhr=(),microphone=(),camera=(),magnetometer=(),gyroscope=(),fullscreen=(self),payment=()")
    c.Next()
  })

  r.GET("/ping", func(c *gin.Context) {
    c.JSON(200, gin.H{
      "message": "pong",
    })
  })

  r.Run() // listen and serve on 0.0.0.0:8080
}
```

You can test it via `curl`:

```bash
// Check Headers

curl localhost:8080/ping -I

HTTP/1.1 404 Not Found
Content-Security-Policy: default-src 'self'; connect-src *; font-src *; script-src-elem * 'unsafe-inline'; img-src * data:; style-src * 'unsafe-inline';
Content-Type: text/plain
Permissions-Policy: geolocation=(),midi=(),sync-xhr=(),microphone=(),camera=(),magnetometer=(),gyroscope=(),fullscreen=(self),payment=()
Referrer-Policy: strict-origin
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-Xss-Protection: 1; mode=block
Date: Sat, 30 Mar 2024 08:20:44 GMT
Content-Length: 18

// Check Host Header Injection

curl localhost:8080/ping -I -H "Host:neti.ee"

HTTP/1.1 400 Bad Request
Content-Type: application/json; charset=utf-8
Date: Sat, 30 Mar 2024 08:21:09 GMT
Content-Length: 31
```

Optionally, use [gin helmet](https://github.com/danielkov/gin-helmet) `go get github.com/danielkov/gin-helmet/ginhelmet`

```go
package main

import (
  "github.com/gin-gonic/gin"
  "github.com/danielkov/gin-helmet/ginhelmet"
)

func main() {
  r := gin.Default()

  // Use default security headers
  r.Use(ginhelmet.Default())

  r.GET("/", func(c *gin.Context) {
    c.JSON(200, gin.H{"message": "Hello, World!"})
  })

  r.Run()
}
```
