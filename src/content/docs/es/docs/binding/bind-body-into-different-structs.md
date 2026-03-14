---
title: "Intentar enlazar el cuerpo en diferentes structs"
sidebar:
  order: 13
---

Los métodos normales para enlazar el cuerpo de la solicitud consumen `c.Request.Body` y no
pueden ser llamados múltiples veces.

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

Para esto, puedes usar `c.ShouldBindBodyWith`.

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

* `c.ShouldBindBodyWith` almacena el cuerpo en el contexto antes del enlace. Esto tiene
un ligero impacto en el rendimiento, por lo que no deberías usar este método si solo necesitas enlazar una vez.
* Esta funcionalidad solo es necesaria para algunos formatos -- `JSON`, `XML`, `MsgPack`,
`ProtoBuf`. Para otros formatos, `Query`, `Form`, `FormPost`, `FormMultipart`,
pueden ser llamados por `c.ShouldBind()` múltiples veces sin ningún daño al
rendimiento (Ver [#1341](https://github.com/gin-gonic/gin/pull/1341)).

