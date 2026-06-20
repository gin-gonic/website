---
title: "Trusted proxies"
sidebar:
  order: 8
---

Gin lets you specify which headers to hold the real client IP (if any),
as well as specifying which proxies (or direct clients) you trust to
specify one of these headers.

### Why trusted proxy configuration matters

When your application sits behind a reverse proxy (Nginx, HAProxy, a cloud load balancer, etc.), the proxy forwards the original client's IP address in headers like `X-Forwarded-For` or `X-Real-Ip`. The problem is that **any client can set these headers**. Without proper trusted proxy configuration, an attacker can forge `X-Forwarded-For` to:

- **Bypass IP-based access controls** -- If your application restricts certain routes to an internal IP range (e.g., `10.0.0.0/8`), an attacker can send `X-Forwarded-For: 10.0.0.1` from a public IP and bypass the restriction entirely.
- **Poison logs and audit trails** -- Forged IPs make incident investigation unreliable because you can no longer trace requests back to the real source.
- **Evade rate limiting** -- If rate limiting is keyed on `ClientIP()`, each request can claim a different IP address to avoid being throttled.

`SetTrustedProxies` solves this by telling Gin which network addresses are legitimate proxies. When `ClientIP()` parses the `X-Forwarded-For` chain, it only trusts entries added by those proxies and discards anything a client may have prepended. If a request arrives directly (not from a trusted proxy), the forwarding headers are ignored entirely and the raw remote address is used.

Use function `SetTrustedProxies()` on your `gin.Engine` to specify network addresses
or network CIDRs from where clients which their request headers related to client
IP can be trusted. They can be IPv4 addresses, IPv4 CIDRs, IPv6 addresses or
IPv6 CIDRs.

**Attention:** Gin trusts all proxies by default if you don't specify a trusted
proxy using the function above, **this is NOT safe**. At the same time, if you don't
use any proxy, you can disable this feature by using `Engine.SetTrustedProxies(nil)`,
then `Context.ClientIP()` will return the remote address directly to avoid some
unnecessary computation.

```go
import (
  "fmt"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()
  router.SetTrustedProxies([]string{"192.168.1.2"})

  router.GET("/", func(c *gin.Context) {
    // If the client is 192.168.1.2, use the X-Forwarded-For
    // header to deduce the original client IP from the trust-
    // worthy parts of that header.
    // Otherwise, simply return the direct client IP
    fmt.Printf("ClientIP: %s\n", c.ClientIP())
  })
  router.Run()
}
```

**Notice:** If you are using a CDN service, you can set the `Engine.TrustedPlatform`
to skip TrustedProxies check, it has a higher priority than TrustedProxies.
Look at the example below:

```go
import (
  "fmt"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()
  // Use predefined header gin.PlatformXXX
  // Google App Engine
  router.TrustedPlatform = gin.PlatformGoogleAppEngine
  // Cloudflare
  router.TrustedPlatform = gin.PlatformCloudflare
  // Fly.io
  router.TrustedPlatform = gin.PlatformFlyIO
  // Or, you can set your own trusted request header. But be sure your CDN
  // prevents users from passing this header! For example, if your CDN puts
  // the client IP in X-CDN-Client-IP:
  router.TrustedPlatform = "X-CDN-Client-IP"

  router.GET("/", func(c *gin.Context) {
    // If you set TrustedPlatform, ClientIP() will resolve the
    // corresponding header and return IP directly
    fmt.Printf("ClientIP: %s\n", c.ClientIP())
  })
  router.Run()
}
```
