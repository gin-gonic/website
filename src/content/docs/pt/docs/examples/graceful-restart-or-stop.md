---
title: "Reinicialização ou Interrupção Graciosa"

---

Queres reiniciar ou parar graciosamente o teu servidor de web?
Existem algumas maneiras disto poder ser feito.

Nós podemos usar o [fvbock/endless](https://github.com/fvbock/endless) para substituir o `ListenAndServe` padrão. Consulte a questão [#296](https://github.com/gin-gonic/gin/issues/296) por mais detalhes:

```go
router := gin.Default()
router.GET("/", handler)
// [...]
endless.ListenAndServe(":4242", router)
```

Uma alternativa ao `endless`:

* [`manners`](https://github.com/braintree/manners): Um servidor de HTTP de Go delicado que desliga graciosamente.
* [`graceful`](https://github.com/tylerb/graceful): é uma pacote de Go que ativa a paragem graciosa dum servidor de `http.Handler`.
* [`grace`](https://github.com/facebookgo/grace): reinicialização graciosa & implementação de produção de tempo de inatividade zero para servidores de Go.

Se usas a Go 1.8, podes não precisar de usar esta biblioteca! Considere usar o método [Shutdown()](https://golang.org/pkg/net/http/#Server.Shutdown) embutido da `http.Server` para paragens graciosas. Consulte o exemplo [graceful-shutdown](https://github.com/gin-gonic/examples/tree/master/graceful-shutdown) completo com a Gin:

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
		// servir conexões ou conexões de serviço
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("listen: %s\n", err)
		}
	}()

	// espere pelo sinal de interrupção para parar graciosamente o
	// servidor com uma pausa de 5 segundos.
	quit := make(chan os.Signal, 1)
	// "kill" padrão (sem parâmetro) envia "syscall.SIGTERM"
	// "kill -2" é "syscall.SIGINT"
	// "kill -9" é "syscall.SIGKILL" mas não pode ser capturado,
	// então não precisas adicioná-lo
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("Shutdown Server ...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		log.Fatal("Server Shutdown:", err)
	}
	// capturar ctx.Done(). pausa de 5 segundos.
	select {
	case <-ctx.Done():
		log.Println("timeout of 5 seconds.")
	}
	log.Println("Server exiting")
}
```

