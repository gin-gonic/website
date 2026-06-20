---
title: "Executar múltiplos serviços"
sidebar:
  order: 4
---

Você pode executar múltiplos servidores Gin no mesmo processo — cada um em uma porta diferente — usando `errgroup.Group` do pacote `golang.org/x/sync/errgroup`. Isso é útil quando você precisa expor APIs separadas (por exemplo, uma API pública na porta 8080 e uma API de administração na porta 8081) sem implantar binários separados.

Cada servidor tem seu próprio router, pilha de middleware e configuração de `http.Server`.

```go
package main

import (
  "log"
  "net/http"
  "time"

  "github.com/gin-gonic/gin"
  "golang.org/x/sync/errgroup"
)

var (
  g errgroup.Group
)

func router01() http.Handler {
  e := gin.New()
  e.Use(gin.Recovery())
  e.GET("/", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{
      "code":    http.StatusOK,
      "message": "Welcome server 01",
    })
  })

  return e
}

func router02() http.Handler {
  e := gin.New()
  e.Use(gin.Recovery())
  e.GET("/", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{
      "code":    http.StatusOK,
      "message": "Welcome server 02",
    })
  })

  return e
}

func main() {
  server01 := &http.Server{
    Addr:         ":8080",
    Handler:      router01(),
    ReadTimeout:  5 * time.Second,
    WriteTimeout: 10 * time.Second,
  }

  server02 := &http.Server{
    Addr:         ":8081",
    Handler:      router02(),
    ReadTimeout:  5 * time.Second,
    WriteTimeout: 10 * time.Second,
  }

  g.Go(func() error {
    return server01.ListenAndServe()
  })

  g.Go(func() error {
    return server02.ListenAndServe()
  })

  if err := g.Wait(); err != nil {
    log.Fatal(err)
  }
}
```

## Teste

```sh
# Server 01 on port 8080
curl http://localhost:8080/
# Output: {"code":200,"message":"Welcome server 01"}

# Server 02 on port 8081
curl http://localhost:8081/
# Output: {"code":200,"message":"Welcome server 02"}
```

:::note
Se qualquer servidor falhar ao iniciar (por exemplo, se uma porta já estiver em uso), `g.Wait()` retorna o primeiro erro. Ambos os servidores devem iniciar com sucesso para que o processo continue em execução.
:::

## Veja também

- [Configuração HTTP customizada](/pt/docs/server-config/custom-http-config/)
- [Reinício ou parada graciosa](/pt/docs/server-config/graceful-restart-or-stop/)
