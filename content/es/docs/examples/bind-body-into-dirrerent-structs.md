---
title: "Vincular el cuerpo de un request en distintos tipos de structs"
draft: false
---

El método común para vincular el cuerpo de un request emplea `c.Request.Body` pero presenta
el limitante que no puede llamarse múltiples veces.

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
  // c.ShouldBind consume c.Request.Body y no puede volverse a usar.
  if errA := c.ShouldBind(&objA); errA == nil {
    c.String(http.StatusOK, `the body should be formA`)
  // La condición de error siempre se cumplirá aquí porque c.Request.Body retornará EOF.
  } else if errB := c.ShouldBind(&objB); errB == nil {
    c.String(http.StatusOK, `the body should be formB`)
  } else {
    ...
  }
}
```

For this, you can use `c.ShouldBindBodyWith`.

```go
func SomeHandler(c *gin.Context) {
  objA := formA{}
  objB := formB{}
  // Aquí se lee c.Request.Body y el resultado es almacenado en context.
  if errA := c.ShouldBindBodyWith(&objA, binding.JSON); errA == nil {
    c.String(http.StatusOK, `the body should be formA`)
  // Esta vez, se reúsa el body almacenado en el context.
  } else if errB := c.ShouldBindBodyWith(&objB, binding.JSON); errB == nil {
    c.String(http.StatusOK, `the body should be formB JSON`)
  // También puede aceptar otros formatos
  } else if errB2 := c.ShouldBindBodyWith(&objB, binding.XML); errB2 == nil {
    c.String(http.StatusOK, `the body should be formB XML`)
  } else {
    ...
  }
}
```

* `c.ShouldBindBodyWith` almacena el cuerpo en el context antes de hacer el vínculo. Esto tiene
un ligero impacto en el rendimiento, así que no deberías usar este método si
no es necesario vincular más de un tipo de struct a la vez.
* Esta característica sólamente es necesaria en algunos formatos -- `JSON`, `XML`, `MsgPack`,
`ProtoBuf`. Para otros tipos, `Query`, `Form`, `FormPost`, `FormMultipart`,
puede ser llamada a través de `c.ShouldBind()` sin impacto negativo
en el rendimiento (Véase [#1341](https://github.com/gin-gonic/gin/pull/1341)).

