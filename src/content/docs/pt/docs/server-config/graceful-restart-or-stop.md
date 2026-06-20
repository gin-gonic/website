---
title: "Reinicialização ou parada graciosa"
sidebar:
  order: 5
---

Quando um processo de servidor recebe um sinal de encerramento (por exemplo, durante uma implantação ou evento de escalonamento), um desligamento imediato descarta todas as requisições em andamento, deixando clientes com conexões quebradas e operações potencialmente corrompidas. Um **desligamento gracioso** resolve isso:

- **Completando requisições em andamento** -- Requisições que já estão sendo processadas recebem tempo para terminar, para que os clientes recebam respostas adequadas em vez de resets de conexão.
- **Drenando conexões** -- O servidor para de aceitar novas conexões enquanto as existentes podem ser completadas, prevenindo um corte abrupto.
- **Limpando recursos** -- Conexões de banco de dados abertas, handles de arquivo e workers em segundo plano são fechados adequadamente, evitando corrupção de dados ou vazamento de recursos.
- **Habilitando implantações sem downtime** -- Quando combinado com um load balancer, o desligamento gracioso permite lançar novas versões sem erros visíveis ao usuário.

Existem várias formas de alcançar isso em Go.

Podemos usar [fvbock/endless](https://github.com/fvbock/endless) para substituir o `ListenAndServe` padrão. Consulte a issue [#296](https://github.com/gin-gonic/gin/issues/296) para mais detalhes.

```go
router := gin.Default()
router.GET("/", handler)
// [...]
endless.ListenAndServe(":4242", router)
```

Alternativas ao endless:

* [manners](https://github.com/braintree/manners): Um servidor HTTP Go educado que desliga graciosamente.
* [graceful](https://github.com/tylerb/graceful): Graceful é um pacote Go que habilita o desligamento gracioso de um servidor http.Handler.
* [grace](https://github.com/facebookgo/grace): Reinicialização graciosa e implantação sem downtime para servidores Go.

Se você estiver usando Go 1.8 ou posterior, pode não precisar usar esta biblioteca! Considere usar o método integrado [Shutdown()](https://golang.org/pkg/net/http/#Server.Shutdown) do `http.Server` para desligamentos graciosos. Veja o exemplo completo de [graceful-shutdown](https://github.com/gin-gonic/examples/tree/master/graceful-shutdown) com gin.

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
