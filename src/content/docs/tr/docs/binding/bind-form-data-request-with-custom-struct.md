---
title: "Özel struct ile form verisi bağlama"
sidebar:
  order: 12
---

Gin, form verisini iç içe struct'lara otomatik olarak bağlayabilir. Veri modeliniz daha küçük struct'lardan oluştuğunda — gömülü alanlar, pointer alanları veya anonim satır içi struct'lar olarak — Gin struct hiyerarşisini dolaşır ve her `form` etiketini karşılık gelen sorgu parametresi veya form alanıyla eşleştirir.

Bu, birçok alana sahip tek bir düz struct tanımlamak yerine karmaşık formları yeniden kullanılabilir alt yapılara organize etmek için kullanışlıdır.

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

## Test et

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
Her üç desen — iç içe struct, iç içe struct pointer'ı ve anonim satır içi struct — aynı düz sorgu parametreleri kullanılarak bağlanır. Gin, parametre adlarında herhangi bir önek veya iç içe geçme kuralı gerektirmez.
:::

## Ayrıca bakınız

- [Bağlama ve doğrulama](/tr/docs/binding/binding-and-validation/)
- [Özel struct etiketi ile form verisi bağlama](/tr/docs/binding/bind-form-data-custom-struct-tag/)
