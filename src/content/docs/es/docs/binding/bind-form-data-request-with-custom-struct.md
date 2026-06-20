---
title: "Enlazar solicitud de datos de formulario con struct personalizado"
sidebar:
  order: 12
---

Gin puede enlazar datos de formulario en structs anidados automáticamente. Cuando tu modelo de datos está compuesto por structs más pequeños — ya sea como campos embebidos, campos de puntero o structs anónimos en línea — Gin recorre la jerarquía del struct y mapea cada etiqueta `form` al parámetro de consulta o campo de formulario correspondiente.

Esto es útil para organizar formularios complejos en subestructuras reutilizables en lugar de definir un solo struct plano con muchos campos.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

type StructA struct {
  FieldA string `form:"field_a"`
}

type StructB struct {
  NestedStruct StructA
  FieldB       string `form:"field_b"`
}

type StructC struct {
  NestedStructPointer *StructA
  FieldC              string `form:"field_c"`
}

type StructD struct {
  NestedAnonyStruct struct {
    FieldX string `form:"field_x"`
  }
  FieldD string `form:"field_d"`
}

func main() {
  router := gin.Default()

  router.GET("/getb", func(c *gin.Context) {
    var b StructB
    c.Bind(&b)
    c.JSON(http.StatusOK, gin.H{
      "a": b.NestedStruct,
      "b": b.FieldB,
    })
  })

  router.GET("/getc", func(c *gin.Context) {
    var b StructC
    c.Bind(&b)
    c.JSON(http.StatusOK, gin.H{
      "a": b.NestedStructPointer,
      "c": b.FieldC,
    })
  })

  router.GET("/getd", func(c *gin.Context) {
    var b StructD
    c.Bind(&b)
    c.JSON(http.StatusOK, gin.H{
      "x": b.NestedAnonyStruct,
      "d": b.FieldD,
    })
  })

  router.Run(":8080")
}
```

## Pruébalo

```sh
# Nested struct -- fields from StructA are bound alongside StructB's own fields
curl "http://localhost:8080/getb?field_a=hello&field_b=world"
# Output: {"a":{"FieldA":"hello"},"b":"world"}

# Nested struct pointer -- works the same way, Gin allocates the pointer automatically
curl "http://localhost:8080/getc?field_a=hello&field_c=world"
# Output: {"a":{"FieldA":"hello"},"c":"world"}

# Anonymous inline struct -- fields are bound by their form tags as usual
curl "http://localhost:8080/getd?field_x=hello&field_d=world"
# Output: {"d":"world","x":{"FieldX":"hello"}}
```

:::note
Los tres patrones — struct anidado, puntero a struct anidado y struct anónimo en línea — se enlazan usando los mismos parámetros de consulta planos. Gin no requiere ningún prefijo o convención de anidamiento en los nombres de los parámetros.
:::

## Ver también

- [Enlace y validación](/es/docs/binding/binding-and-validation/)
- [Enlazar datos de formulario con etiqueta de struct personalizada](/es/docs/binding/bind-form-data-custom-struct-tag/)
