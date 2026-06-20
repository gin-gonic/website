---
title: "Bind permintaan form-data dengan struct kustom"
sidebar:
  order: 12
---

Gin dapat melakukan bind data form ke struct bersarang secara otomatis. Ketika model data Anda terdiri dari struct-struct yang lebih kecil — baik sebagai field embedded, field pointer, atau struct inline anonim — Gin menelusuri hierarki struct dan memetakan setiap tag `form` ke parameter query atau field form yang sesuai.

Ini berguna untuk mengorganisasi form yang kompleks menjadi sub-struktur yang dapat digunakan kembali daripada mendefinisikan satu struct datar dengan banyak field.

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

## Uji coba

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
Ketiga pola — struct bersarang, pointer struct bersarang, dan struct inline anonim — di-bind menggunakan parameter query datar yang sama. Gin tidak memerlukan konvensi prefix atau nesting pada nama parameter.
:::

## Lihat juga

- [Binding dan validasi](/id/docs/binding/binding-and-validation/)
- [Bind form-data dengan tag struct kustom](/id/docs/binding/bind-form-data-custom-struct-tag/)
