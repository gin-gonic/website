---
title: "Vincular requisição form-data com struct customizada"
sidebar:
  order: 12
---

O Gin pode vincular dados de formulário em structs aninhadas automaticamente. Quando seu modelo de dados é composto por structs menores — seja como campos embutidos, campos de ponteiro ou structs anônimas inline — o Gin percorre a hierarquia da struct e mapeia cada tag `form` para o parâmetro de query ou campo de formulário correspondente.

Isso é útil para organizar formulários complexos em subestruturas reutilizáveis em vez de definir uma única struct plana com muitos campos.

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

## Teste

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
Todos os três padrões — struct aninhada, ponteiro de struct aninhada e struct anônima inline — são vinculados usando os mesmos parâmetros de query planos. O Gin não requer nenhum prefixo ou convenção de aninhamento nos nomes dos parâmetros.
:::

## Veja também

- [Binding e validação](/pt/docs/binding/binding-and-validation/)
- [Vincular form-data com tag de struct customizada](/pt/docs/binding/bind-form-data-custom-struct-tag/)
