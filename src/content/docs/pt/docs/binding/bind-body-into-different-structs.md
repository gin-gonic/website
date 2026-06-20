---
title: "Vincular body em structs diferentes"
sidebar:
  order: 13
---

Os métodos padrão de binding como `c.ShouldBind` consomem `c.Request.Body`, que é um `io.ReadCloser` — uma vez lido, não pode ser lido novamente. Isso significa que você não pode chamar `c.ShouldBind` múltiplas vezes na mesma requisição para tentar diferentes formatos de struct.

Para resolver isso, use `c.ShouldBindBodyWith`. Ele lê o body uma vez e o armazena no contexto, permitindo que bindings subsequentes reutilizem o body armazenado em cache.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
  "github.com/gin-gonic/gin/binding"
)

type formA struct {
  Foo string `json:"foo" xml:"foo" binding:"required"`
}

type formB struct {
  Bar string `json:"bar" xml:"bar" binding:"required"`
}

func main() {
  router := gin.Default()

  router.POST("/bind", func(c *gin.Context) {
    objA := formA{}
    objB := formB{}
    // This reads c.Request.Body and stores the result into the context.
    if errA := c.ShouldBindBodyWith(&objA, binding.JSON); errA == nil {
      c.JSON(http.StatusOK, gin.H{"message": "matched formA", "foo": objA.Foo})
      return
    }
    // At this time, it reuses body stored in the context.
    if errB := c.ShouldBindBodyWith(&objB, binding.JSON); errB == nil {
      c.JSON(http.StatusOK, gin.H{"message": "matched formB", "bar": objB.Bar})
      return
    }

    c.JSON(http.StatusBadRequest, gin.H{"error": "request body did not match any known format"})
  })

  router.Run(":8080")
}
```

## Teste

```sh
# Body matches formA
curl -X POST http://localhost:8080/bind \
  -H "Content-Type: application/json" \
  -d '{"foo":"hello"}'
# Output: {"foo":"hello","message":"matched formA"}

# Body matches formB
curl -X POST http://localhost:8080/bind \
  -H "Content-Type: application/json" \
  -d '{"bar":"world"}'
# Output: {"bar":"world","message":"matched formB"}
```

:::note
`c.ShouldBindBodyWith` armazena o body no contexto antes de fazer o binding. Isso tem um leve impacto na performance, então use apenas quando precisar fazer o binding do body mais de uma vez. Para formatos que não leem o body — como `Query`, `Form`, `FormPost`, `FormMultipart` — você pode chamar `c.ShouldBind()` múltiplas vezes sem problemas.
:::

## Veja também

- [Binding e validação](/pt/docs/binding/binding-and-validation/)
- [Vincular query string ou dados post](/pt/docs/binding/bind-query-or-post/)
