---
title: "Configuración del servidor"
sidebar:
  order: 8
---

Gin ofrece opciones flexibles de configuración del servidor. Dado que `gin.Engine` implementa la interfaz `http.Handler`, puedes usarlo con el `net/http.Server` estándar de Go para controlar tiempos de espera, TLS y otras configuraciones directamente.

## Usando un http.Server personalizado

Por defecto, `router.Run()` inicia un servidor HTTP básico. Para uso en producción, crea tu propio `http.Server` para configurar tiempos de espera y otras opciones:

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

Esto te da acceso completo a la configuración del servidor de Go mientras mantienes todas las capacidades de enrutamiento y middleware de Gin.

## En esta sección

- [**Configuración HTTP personalizada**](./custom-http-config/) -- Ajustar el servidor HTTP subyacente
- [**Códec JSON personalizado**](./custom-json-codec/) -- Usar bibliotecas alternativas de serialización JSON
- [**Let's Encrypt**](./lets-encrypt/) -- Certificados TLS automáticos con Let's Encrypt
- [**Ejecutar múltiples servicios**](./multiple-service/) -- Servir múltiples motores Gin en diferentes puertos
- [**Reinicio o parada elegante**](./graceful-restart-or-stop/) -- Apagar sin interrumpir conexiones activas
- [**HTTP/2 server push**](./http2-server-push/) -- Enviar recursos al cliente de forma proactiva
- [**Manejo de cookies**](./cookie/) -- Leer y escribir cookies HTTP
- [**Proxies de confianza**](./trusted-proxies/) -- Configurar qué proxies confía Gin para la resolución de IP del cliente
