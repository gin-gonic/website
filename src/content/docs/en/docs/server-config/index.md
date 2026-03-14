---
title: "Server Configuration"
sidebar:
  order: 8
---

Gin offers flexible server configuration options. Because `gin.Engine` implements the `http.Handler` interface, you can use it with Go's standard `net/http.Server` to control timeouts, TLS, and other settings directly.

## Using a custom http.Server

By default, `router.Run()` starts a basic HTTP server. For production use, create your own `http.Server` to set timeouts and other options:

```go
func main() {
  router := gin.Default()
  router.GET("/", func(c *gin.Context) {
    c.String(200, "ok")
  })

  s := &http.Server{
    Addr:           ":8080",
    Handler:        router,
    ReadTimeout:    10 * time.Second,
    WriteTimeout:   10 * time.Second,
    MaxHeaderBytes: 1 << 20,
  }
  s.ListenAndServe()
}
```

This gives you full access to Go's server configuration while keeping all of Gin's routing and middleware capabilities.

## In this section

- [**Custom HTTP configuration**](./custom-http-config/) -- Fine-tune the underlying HTTP server
- [**Custom JSON codec**](./custom-json-codec/) -- Use alternative JSON serialization libraries
- [**Let's Encrypt**](./lets-encrypt/) -- Automatic TLS certificates with Let's Encrypt
- [**Running multiple services**](./multiple-service/) -- Serve multiple Gin engines on different ports
- [**Graceful restart or stop**](./graceful-restart-or-stop/) -- Shut down without dropping active connections
- [**HTTP/2 server push**](./http2-server-push/) -- Push resources to the client proactively
- [**Cookie handling**](./cookie/) -- Read and write HTTP cookies
- [**Trusted proxies**](./trusted-proxies/) -- Configure which proxies Gin trusts for client IP resolution
