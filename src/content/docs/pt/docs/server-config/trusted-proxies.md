---
title: "Proxies confiáveis"
sidebar:
  order: 8
---

O Gin permite especificar quais headers contêm o IP real do cliente (se houver), bem como especificar quais proxies (ou clientes diretos) você confia para definir um desses headers.

### Por que a configuração de proxy confiável é importante

Quando sua aplicação está atrás de um proxy reverso (Nginx, HAProxy, um load balancer na nuvem, etc.), o proxy encaminha o endereço IP original do cliente em headers como `X-Forwarded-For` ou `X-Real-Ip`. O problema é que **qualquer cliente pode definir esses headers**. Sem a configuração adequada de proxy confiável, um atacante pode forjar `X-Forwarded-For` para:

- **Contornar controles de acesso baseados em IP** -- Se sua aplicação restringe certas rotas a um range de IP interno (ex.: `10.0.0.0/8`), um atacante pode enviar `X-Forwarded-For: 10.0.0.1` de um IP público e contornar a restrição completamente.
- **Envenenar logs e trilhas de auditoria** -- IPs forjados tornam a investigação de incidentes pouco confiável porque você não consegue mais rastrear requisições até a fonte real.
- **Evadir rate limiting** -- Se o rate limiting é baseado em `ClientIP()`, cada requisição pode alegar um endereço IP diferente para evitar ser limitada.

`SetTrustedProxies` resolve isso dizendo ao Gin quais endereços de rede são proxies legítimos. Quando `ClientIP()` analisa a cadeia `X-Forwarded-For`, ele confia apenas nas entradas adicionadas por esses proxies e descarta qualquer coisa que um cliente possa ter adicionado. Se uma requisição chega diretamente (não de um proxy confiável), os headers de encaminhamento são ignorados completamente e o endereço remoto bruto é usado.

Use a função `SetTrustedProxies()` no seu `gin.Engine` para especificar endereços de rede ou CIDRs de onde os headers de requisição dos clientes relacionados ao IP do cliente podem ser confiáveis. Podem ser endereços IPv4, CIDRs IPv4, endereços IPv6 ou CIDRs IPv6.

**Atenção:** O Gin confia em todos os proxies por padrão se você não especificar um proxy confiável usando a função acima, **isso NÃO é seguro**. Ao mesmo tempo, se você não usa nenhum proxy, pode desabilitar este recurso usando `Engine.SetTrustedProxies(nil)`, então `Context.ClientIP()` retornará o endereço remoto diretamente para evitar computação desnecessária.

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

**Aviso:** Se você está usando um serviço CDN, pode definir `Engine.TrustedPlatform` para pular a verificação de TrustedProxies, que tem prioridade maior que TrustedProxies. Veja o exemplo abaixo:

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
