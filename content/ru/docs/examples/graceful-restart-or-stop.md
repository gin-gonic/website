---
Заголовок: "Благодатный перезапуск или остановка"
черновик: false
---

Вы хотите произвести плавный перезапуск или остановку вашего веб-сервера?
Есть несколько способов сделать это.

Мы можем использовать [fvbock/endless](https://github.com/fvbock/endless) для замены стандартного `ListenAndServe`. Более подробную информацию см. в выпуске [#296](https://github.com/gin-gonic/gin/issues/296).

```go
router := gin.Default()
router.GET("/", handler)
// [...]
endless.ListenAndServe(":4242", router)
```

Альтернатива бесконечности:

* [manners](https://github.com/braintree/manners): Вежливый HTTP-сервер Go, который изящно завершает работу.
* [graceful](https://github.com/tylerb/graceful): Graceful - это пакет Go, позволяющий изящно завершить работу сервера http.Handler.
* [grace](https://github.com/facebookgo/grace): Graceful restart & zero downtime deploy для Go-серверов.

Если вы используете Go 1.8, возможно, вам не понадобится эта библиотека! Лучше используйте встроенный метод http.Server [Shutdown()](https://golang.org/pkg/net/http/#Server.Shutdown) для изящного завершения работы. Посмотрите полный пример [graceful-shutdown](https://github.com/gin-gonic/examples/tree/master/graceful-shutdown) с gin.

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
	// kill (no param) default send syscall.SIGTERM
	// kill -2 is syscall.SIGINT
	// kill -9 is syscall. SIGKILL but can"t be catch, so don't need add it
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("Shutdown Server ...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		log.Fatal("Server Shutdown:", err)
	}
	// catching ctx.Done(). timeout of 5 seconds.
	select {
	case <-ctx.Done():
		log.Println("timeout of 5 seconds.")
	}
	log.Println("Server exiting")
}
```

