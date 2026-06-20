---
title: "Intentar enlazar el cuerpo en diferentes structs"
sidebar:
  order: 13
---

Los métodos de enlace estándar como `c.ShouldBind` consumen `c.Request.Body`, que es un `io.ReadCloser` — una vez leído, no se puede leer de nuevo. Esto significa que no puedes llamar a `c.ShouldBind` múltiples veces en la misma solicitud para probar diferentes formas de struct.

Para resolver esto, usa `c.ShouldBindBodyWith`. Lee el cuerpo una vez y lo almacena en el contexto, permitiendo que los enlaces posteriores reutilicen el cuerpo almacenado en caché.

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

## Pruébalo

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
`c.ShouldBindBodyWith` almacena el cuerpo en el contexto antes de enlazarlo. Esto tiene un ligero impacto en el rendimiento, por lo que solo úsalo cuando necesites enlazar el cuerpo más de una vez. Para formatos que no leen el cuerpo — como `Query`, `Form`, `FormPost`, `FormMultipart` — puedes llamar a `c.ShouldBind()` múltiples veces sin problema.
:::

## Ver también

- [Enlace y validación](/es/docs/binding/binding-and-validation/)
- [Enlazar cadena de consulta o datos post](/es/docs/binding/bind-query-or-post/)
