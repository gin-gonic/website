---
title: "Implementação em Produção"
draft: false
weight: 6
---

Os projetos de Gin podem ser implementados em produção facilmente em qualquer provedor da nuvem.

## [Koyeb](https://www.koyeb.com)

A Koyeb é uma plataforma sem servidor amistosa ao programador para implementar as aplicações localmente em produção com a implementação baseada em Git, encriptação de TLS, auto-escalamento nativo, rede de fio global, e malha de rede de serviço e descoberta embutido.

Siga o [guia da Koyeb para implementar em produção os teus projetos de Gin](https://www.koyeb.com/tutorials/deploy-go-gin-on-koyeb).

## [Qovery](https://www.qovery.com)

A Qovery fornece hospedagem de nuvem gratuita com bases de dados, SSL, uma CDN global e implementações em produção automáticas com a Git.

Siga o [guia da Qovery para implementar o teu projeto de Gin em produção](https://docs.qovery.com/guides/tutorial/deploy-gin-with-postgresql/).

## [Render](https://render.com)

A Render é uma plataforma da nuvem moderna que oferece suporte nativo para a Go, SSL completamente administrado, bases de dados, implementações em produção com tempo de inatividade zero, HTTP/2, e suporte a websocket.

Siga o [guia da Render para implementação de projetos de Gin em produção](https://render.com/docs/deploy-go-gin).

## [Google App Engine](https://cloud.google.com/appengine/)

A GAE tem duas maneiras de implementar aplicações de Go em produção. O ambiente padrão é mais fácil de usar mas menos personalizável e impedi [syscalls](https://github.com/gin-gonic/gin/issues/1639) por razões de segurança. O ambiente flexível pode executar qualquer abstração ou biblioteca.

Saiba mais e escolha o teu ambiente preferido na [Go sobre a Google App Engine](https://cloud.google.com/appengine/docs/go/).

## Self Hosted

Gin projects can also be deployed in a self-hosted manner. Deployment architecture and security considerations vary depending on the target environment. The following section only presents a high level overview of configuration options to consider when planning the deployment.

## Configuration Options

Gin project deployments can be tuned by using environment variables or directly in code.

The following environment variables are available for configuring Gin:

| Environment Variable | Description                                                                                                                                                                                                   |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PORT                 | The TCP port to listen on when starting the Gin server with `router.Run()` (i.e. without any arguments).                                                                                                      |
| GIN_MODE             | Set to one of `debug`, `release`, or `test`. Handles management of Gin modes, such as when to emit debug outputs. Can also be set in code using `gin.SetMode(gin.ReleaseMode)` or `gin.SetMode(gin.TestMode)` |

The following code can be used to configure Gin.

```go
// Don't specify the bind address or port for Gin. Defaults to binding on all interfaces on port 8080.
// Can use the `PORT` environment variable to change the listen port when using `Run()` without any arguments.
router := gin.Default()
router.Run()

// Specify the bind address and port for Gin.
router := gin.Default()
router.Run("192.168.1.100:8080")

// Specify only the listen port. Will bind on all interfaces.
router := gin.Default()
router.Run(":8080")

// Set which IP addresses or CIDRs, are considered to be trusted for setting headers to document real client IP addresses.
// See the documentation for additional details.
router := gin.Default()
router.SetTrustedProxies([]string{"192.168.1.2"})
```

## Don't trust all proxies

Gin lets you specify which headers to hold the real client IP (if any),
as well as specifying which proxies (or direct clients) you trust to
specify one of these headers.

Use function `SetTrustedProxies()` on your `gin.Engine` to specify network addresses
or network CIDRs from where clients which their request headers related to client
IP can be trusted. They can be IPv4 addresses, IPv4 CIDRs, IPv6 addresses or
IPv6 CIDRs.

**Attention:** Gin trust all proxies by default if you don't specify a trusted
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
