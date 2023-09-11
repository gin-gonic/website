---
title: "Tentar vincular o corpo à diferentes estruturas"
draft: false
---

Os métodos normais para vincular o corpo da requisição consumem a `c.Request.Body` e não podem ser chamados várias vezes:

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
  // Este c.ShouldBind consume o c.Request.Body e não pode ser reutilizado.
  if errA := c.ShouldBind(&objA); errA == nil {
    c.String(http.StatusOK, `the body should be formA`)
  // Um erro sempre acontecerá por aqui porque c.Request.Body agora é EOF
  } else if errB := c.ShouldBind(&objB); errB == nil {
    c.String(http.StatusOK, `the body should be formB`)
  } else {
    ...
  }
}
```

Para isto, podes usar `c.ShouldBindBodyWith`:

```go
func SomeHandler(c *gin.Context) {
  objA := formA{}
  objB := formB{}
  // Isto lê c.Request.Body e armazena o resultado no contexto.
  if errA := c.ShouldBindBodyWith(&objA, binding.JSON); errA == nil {
    c.String(http.StatusOK, `the body should be formA`)
  // Neste momento, ela reutiliza o corpo armazenado no contexto.
  } else if errB := c.ShouldBindBodyWith(&objB, binding.JSON); errB == nil {
    c.String(http.StatusOK, `the body should be formB JSON`)
  // E pode aceitar outros formatos
  } else if errB2 := c.ShouldBindBodyWith(&objB, binding.XML); errB2 == nil {
    c.String(http.StatusOK, `the body should be formB XML`)
  } else {
    ...
  }
}
```

* `c.ShouldBindBodyWidth` armazena o corpo no contexto antes da vinculação. Isto tem um ligeiro impacto no desempenho, então não deverias usar este método se estás bem para chamar a vinculação imediatamente.

* Esta funcionalidade é apenas necessário para alguns formatos -- `JSON`, `XML`, `MsgPack`, `ProtoBuf`. Para outros formatos, `Query`, `Form`, `FormPost`, `FormMultipart`, podem ser chamados pela `c.ShouldBind()` várias vezes sem qualquer dado para o desempenho (consulte a [#1341](https://github.com/gin-gonic/gin/pull/1341)).

