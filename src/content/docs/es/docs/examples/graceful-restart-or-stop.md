---
title: "Apagado o reinicio controlado del servidor web"
---

Estas son algunas formas de reiniciar o detener el servidor web controladamente.

Se puede utilizar [fvbock/endless](https://github.com/fvbock/endless) para sustituir al `ListenAndServe` por defecto. Véase más detalles en [#296](https://github.com/gin-gonic/gin/issues/296).

```go
router := gin.Default()
router.GET("/", handler)
// [...]
endless.ListenAndServe(":4242", router)
```

Alternativas de endless:

* [manners](https://github.com/braintree/manners): Un servidor HTTP para Go con apagado controlado.
* [graceful](https://github.com/tylerb/graceful): Graceful es un paquete de Go que habilita el apagado controlado de un servidor http.Handler.
* [grace](https://github.com/facebookgo/grace): Reinicio controlado y despliegue para servidores Go con libre de interrupción del servicio.

Si estás usando Go 1.8, no necesitas hacer uso de esta librería!. Considera el uso del método [Shutdown()](https://golang.org/pkg/net/http/#Server.Shutdown) que viene incluído en `http.Server` para el apagado controlado. Véase el ejemplo de [apagado controlado](https://github.com/gin-gonic/examples/tree/master/graceful-shutdown) con Gin.

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
