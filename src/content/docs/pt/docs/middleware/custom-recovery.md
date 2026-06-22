---
title: "Comportamento de Recovery customizado"
sidebar:
  order: 4
---

O middleware embutido `gin.Recovery()` do Gin captura qualquer panic que aconteça durante o tratamento de uma requisição, escreve uma resposta `500` e mantém o servidor em execução. Quando você precisa controlar o que acontece durante a recuperação -- por exemplo, para reportar o panic ao usuário, salvá-lo em um banco de dados ou enviá-lo a um serviço de rastreamento de erros -- use `gin.CustomRecovery()` no lugar.

O `gin.CustomRecovery()` recebe um handler com a assinatura `func(c *gin.Context, recovered any)`. O valor `recovered` é o que quer que tenha sido passado para `panic()`. Dentro do handler você decide como responder e então chama `c.AbortWithStatus()` (ou outro método de abort) para que os handlers restantes sejam ignorados.

```go
package main

import (
  "fmt"
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  // Creates a router without any middleware by default
  r := gin.New()

  // Global middleware
  // Logger middleware will write the logs to gin.DefaultWriter even if you set with GIN_MODE=release.
  // By default gin.DefaultWriter = os.Stdout
  r.Use(gin.Logger())

  // Recovery middleware recovers from any panics and writes a 500 if there was one.
  r.Use(gin.CustomRecovery(func(c *gin.Context, recovered any) {
    if err, ok := recovered.(string); ok {
      c.String(http.StatusInternalServerError, fmt.Sprintf("error: %s", err))
    }
    c.AbortWithStatus(http.StatusInternalServerError)
  }))

  r.GET("/panic", func(c *gin.Context) {
    // panic with a string -- the custom middleware could save this to a database or report it to the user
    panic("foo")
  })

  r.GET("/", func(c *gin.Context) {
    c.String(http.StatusOK, "ohai")
  })

  // Listen and serve on 0.0.0.0:8080
  r.Run(":8080")
}
```

## Teste

```bash
# Triggers the panic; the custom recovery handler returns the message
curl http://localhost:8080/panic
# => error: foo

# A normal request still works
curl http://localhost:8080/
# => ohai
```

## Veja também

- [Middleware Customizado](/pt/docs/middleware/custom-middleware/)
- [Gin em branco sem middleware por padrão](/pt/docs/middleware/without-middleware/)
- [Middleware de tratamento de erros](/pt/docs/middleware/error-handling-middleware/)
