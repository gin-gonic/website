---
title: "Reinicio o parada elegante"
sidebar:
  order: 5
---

Cuando un proceso del servidor recibe una señal de terminación (ej. durante un despliegue o evento de escalado), una parada inmediata interrumpe todas las solicitudes en curso, dejando a los clientes con conexiones rotas y operaciones potencialmente corruptas. Una **parada elegante** resuelve esto:

- **Completando solicitudes en curso** -- Las solicitudes que ya se están procesando tienen tiempo para terminar, para que los clientes reciban respuestas adecuadas en lugar de cortes de conexión.
- **Drenando conexiones** -- El servidor deja de aceptar nuevas conexiones mientras las existentes pueden completarse, previniendo un corte repentino.
- **Limpiando recursos** -- Las conexiones de base de datos abiertas, manejadores de archivos y workers en segundo plano se cierran correctamente, evitando corrupción de datos o fugas de recursos.
- **Habilitando despliegues sin tiempo de inactividad** -- Combinado con un balanceador de carga, la parada elegante te permite desplegar nuevas versiones sin errores visibles para el usuario.

Hay varias formas de lograr esto en Go.

Podemos usar [fvbock/endless](https://github.com/fvbock/endless) para reemplazar el `ListenAndServe` predeterminado. Consulta el issue [#296](https://github.com/gin-gonic/gin/issues/296) para más detalles.

```go
router := gin.Default()
router.GET("/", handler)
// [...]
endless.ListenAndServe(":4242", router)
```

Alternativas a endless:

* [manners](https://github.com/braintree/manners): Un servidor HTTP de Go educado que se apaga elegantemente.
* [graceful](https://github.com/tylerb/graceful): Graceful es un paquete de Go que habilita la parada elegante de un servidor http.Handler.
* [grace](https://github.com/facebookgo/grace): Reinicio elegante y despliegue sin tiempo de inactividad para servidores Go.

Si estás usando Go 1.8 o posterior, ¡puede que no necesites usar estas bibliotecas! Considera usar el método integrado [Shutdown()](https://golang.org/pkg/net/http/#Server.Shutdown) de `http.Server` para paradas elegantes. Consulta el ejemplo completo de [graceful-shutdown](https://github.com/gin-gonic/examples/tree/master/graceful-shutdown) con gin.

```go
//go:build go1.8
// +build go1.8

package main

import (
  "context"
  "log"
  "net/http"
  "os"
  "os/signal"
  "syscall"
  "time"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()
  router.GET("/", func(c *gin.Context) {
    time.Sleep(5 * time.Second)
    c.String(http.StatusOK, "Welcome Gin Server")
  })

  srv := &http.Server{
    Addr:    ":8080",
    Handler: router.Handler(),
  }

  go func() {
    // service connections
    if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
      log.Fatalf("listen: %s\n", err)
    }
  }()

  // Wait for interrupt signal to gracefully shutdown the server with
  // a timeout of 5 seconds.
  quit := make(chan os.Signal, 1)
  // kill (no params) by default sends syscall.SIGTERM
  // kill -2 is syscall.SIGINT
  // kill -9 is syscall.SIGKILL but can't be caught, so don't need add it
  signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
  <-quit
  log.Println("Shutdown Server ...")

  ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
  defer cancel()
  if err := srv.Shutdown(ctx); err != nil {
    log.Println("Server Shutdown:", err)
  }
  log.Println("Server exiting")
}
```

