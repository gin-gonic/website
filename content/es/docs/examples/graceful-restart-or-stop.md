---
title: "Apagado o reinicio controlado del servidor web"
draft: false
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
		Handler: router,
	}

	go func() {
		// conexiones de servicio
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("listen: %s\n", err)
		}
	}()

	// Espera por la señal de interrupción para el apagado controlado del servidor
	// con un tiempo de espera de 5 segundos.
	quit := make(chan os.Signal)
	// kill (sin parámetro) envío por defecto de la señal syscanll.SIGTERM
	// kill -2 es syscall.SIGINT
	// kill -9 es syscall.SIGKILL pero no se puede atrapar, así que no es necesario agregarlo
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("Shutdown Server ...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		log.Fatal("Server Shutdown:", err)
	}
	// controlando ctx.Done(). tiempo de espera de 5 segundos.
	select {
	case <-ctx.Done():
		log.Println("timeout of 5 seconds.")
	}
	log.Println("Server exiting")
}
```
