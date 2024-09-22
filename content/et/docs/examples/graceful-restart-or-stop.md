---
title: "Graatsiline taaskäivitamine või seiskamine"
draft: false
---

Kas soovite oma veebiserverit graatsiliselt taaskäivitada või peatada?
Seda saab mõnel viisil teha.

Me võime kasutada [fvbock/endless](https://github.com/fvbock/endless), et asendada vaikimisi `ListenAndServe`. Vaadake probleemi [#296](https://github.com/gin-gonic/gin/issues/296) lisateabe saamiseks.

```go
router := gin.Default()
router.GET("/", handler)
// [...]
endless.ListenAndServe(":4242", router)
```

Alternatiiv lõputule:

* [manners](https://github.com/braintree/manners): A polite Go HTTP server that shuts down gracefully.
* [graceful](https://github.com/tylerb/graceful): Graceful is a Go package enabling graceful shutdown of an http.Handler server.
* [grace](https://github.com/facebookgo/grace): Graceful restart & zero downtime deploy for Go servers.

Kui kasutate versiooni Go 1.8, ei pruugi teil seda teeki vaja minna! Kaaluge http.Server's sisseehitatud [Shutdown()](https://golang.org/pkg/net/http/#Server.Shutdown) meetodi kasutamist graatsiliste seiskamiste jaoks. Vaadake täielikku [graceful-shutdown](https://github.com/gin-gonic/examples/tree/master/graceful-shutdown) näidet gin-iga.

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

