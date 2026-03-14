---
title: "Vincular body em structs diferentes"
sidebar:
  order: 13
---

Os métodos normais para vincular o corpo da requisição consomem `c.Request.Body` e não podem ser chamados múltiplas vezes.

```go
type formA struct {
  Foo string `json:"foo" xml:"foo" binding:"required"`
}

type formB struct {
  Bar string `json:"bar" xml:"bar" binding:"required"`
}

func SomeHandler(c *gin.Context) {
  objA := formA{}
  objB := formB{}
  // This c.ShouldBind consumes c.Request.Body and it cannot be reused.
  if errA := c.ShouldBind(&objA); errA == nil {
    c.String(http.StatusOK, `the body should be formA`)
  // Always an error is occurred by this because c.Request.Body is EOF now.
  } else if errB := c.ShouldBind(&objB); errB == nil {
    c.String(http.StatusOK, `the body should be formB`)
  } else {
    ...
  }
}
```

Para isso, você pode usar `c.ShouldBindBodyWith`.

```go
func SomeHandler(c *gin.Context) {
  objA := formA{}
  objB := formB{}
  // This reads c.Request.Body and stores the result into the context.
  if errA := c.ShouldBindBodyWith(&objA, binding.JSON); errA == nil {
    c.String(http.StatusOK, `the body should be formA`)
  // At this time, it reuses body stored in the context.
  } else if errB := c.ShouldBindBodyWith(&objB, binding.JSON); errB == nil {
    c.String(http.StatusOK, `the body should be formB JSON`)
  // And it can accepts other formats
  } else if errB2 := c.ShouldBindBodyWith(&objB, binding.XML); errB2 == nil {
    c.String(http.StatusOK, `the body should be formB XML`)
  } else {
    ...
  }
}
```

* `c.ShouldBindBodyWith` armazena o body no contexto antes do binding. Isso tem um leve impacto no desempenho, então você não deve usar este método se precisar vincular apenas uma vez.
* Este recurso é necessário apenas para alguns formatos -- `JSON`, `XML`, `MsgPack`,
`ProtoBuf`. Para outros formatos, `Query`, `Form`, `FormPost`, `FormMultipart`,
podem ser chamados por `c.ShouldBind()` múltiplas vezes sem nenhum dano ao
desempenho (Veja [#1341](https://github.com/gin-gonic/gin/pull/1341)).
