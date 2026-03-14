---
title: "Proxies de confianza"
sidebar:
  order: 8
---

Gin te permite especificar qué encabezados contienen la IP real del cliente (si los hay), así como especificar en qué proxies (o clientes directos) confías para establecer uno de estos encabezados.

### Por qué importa la configuración de proxies de confianza

Cuando tu aplicación está detrás de un proxy inverso (Nginx, HAProxy, un balanceador de carga en la nube, etc.), el proxy reenvía la dirección IP original del cliente en encabezados como `X-Forwarded-For` o `X-Real-Ip`. El problema es que **cualquier cliente puede establecer estos encabezados**. Sin una configuración adecuada de proxies de confianza, un atacante puede falsificar `X-Forwarded-For` para:

- **Evadir controles de acceso basados en IP** -- Si tu aplicación restringe ciertas rutas a un rango de IP interno (ej. `10.0.0.0/8`), un atacante puede enviar `X-Forwarded-For: 10.0.0.1` desde una IP pública y evadir la restricción por completo.
- **Envenenar logs y registros de auditoría** -- Las IPs falsificadas hacen que la investigación de incidentes no sea confiable porque ya no puedes rastrear las solicitudes hasta la fuente real.
- **Evadir la limitación de tasa** -- Si la limitación de tasa se basa en `ClientIP()`, cada solicitud puede reclamar una dirección IP diferente para evitar ser limitada.

`SetTrustedProxies` resuelve esto diciéndole a Gin qué direcciones de red son proxies legítimos. Cuando `ClientIP()` analiza la cadena `X-Forwarded-For`, solo confía en las entradas añadidas por esos proxies y descarta cualquier cosa que un cliente haya antepuesto. Si una solicitud llega directamente (no desde un proxy de confianza), los encabezados de reenvío se ignoran por completo y se usa la dirección remota sin procesar.

Usa la función `SetTrustedProxies()` en tu `gin.Engine` para especificar direcciones de red o CIDRs de red desde donde se puede confiar en los encabezados de solicitud de los clientes relacionados con la IP del cliente. Pueden ser direcciones IPv4, CIDRs IPv4, direcciones IPv6 o CIDRs IPv6.

**Atención:** Gin confía en todos los proxies por defecto si no especificas un proxy de confianza usando la función anterior, **esto NO es seguro**. Al mismo tiempo, si no usas ningún proxy, puedes deshabilitar esta característica usando `Engine.SetTrustedProxies(nil)`, entonces `Context.ClientIP()` devolverá la dirección remota directamente para evitar cómputos innecesarios.

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

**Aviso:** Si estás usando un servicio CDN, puedes establecer `Engine.TrustedPlatform` para omitir la verificación de TrustedProxies, tiene mayor prioridad que TrustedProxies. Mira el ejemplo a continuación:

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
