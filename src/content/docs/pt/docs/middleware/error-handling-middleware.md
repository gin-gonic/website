---
title: "Middleware de tratamento de erros"
sidebar:
  order: 4
---

Em uma aplicação RESTful típica, você pode encontrar erros em qualquer rota — entrada inválida, falhas no banco de dados, acesso não autorizado ou bugs internos. Tratar erros individualmente em cada handler leva a código repetitivo e respostas inconsistentes.

Um middleware centralizado de tratamento de erros resolve isso executando após cada requisição e verificando se há erros adicionados ao contexto do Gin via `c.Error(err)`. Se erros forem encontrados, ele envia uma resposta JSON estruturada com um código de status adequado.

```go
package main

import (
  "errors"
  "net/http"

  "github.com/gin-gonic/gin"
)

// ErrorHandler captures errors and returns a consistent JSON error response
func ErrorHandler() gin.HandlerFunc {
  return func(c *gin.Context) {
    c.Next() // Process the request first

    // Check if any errors were added to the context
    if len(c.Errors) > 0 {
      err := c.Errors.Last().Err

      c.JSON(http.StatusInternalServerError, gin.H{
        "success": false,
        "message": err.Error(),
      })
    }
  }
}

func main() {
  r := gin.Default()

  // Attach the error-handling middleware
  r.Use(ErrorHandler())

  r.GET("/ok", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{
      "success": true,
      "message": "Everything is fine!",
    })
  })

  r.GET("/error", func(c *gin.Context) {
    c.Error(errors.New("something went wrong"))
  })

  r.Run(":8080")
}
```

## Teste

```sh
# Successful request
curl http://localhost:8080/ok
# Output: {"message":"Everything is fine!","success":true}

# Error request -- middleware catches the error
curl http://localhost:8080/error
# Output: {"message":"something went wrong","success":false}
```

:::tip
Você pode estender este padrão para mapear tipos de erro específicos para diferentes códigos de status HTTP, ou para registrar erros em um serviço externo antes de responder.
:::

## Veja também

- [Middleware customizado](/pt/docs/middleware/custom-middleware/)
- [Usando middleware](/pt/docs/middleware/using-middleware/)
