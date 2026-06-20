---
title: "اتصال درخواست فرم‌دیتا با struct سفارشی"
sidebar:
  order: 12
---

Gin می‌تواند داده‌های فرم را به‌صورت خودکار به structهای تودرتو متصل کند. وقتی مدل داده شما از structهای کوچک‌تر تشکیل شده -- چه به‌عنوان فیلدهای تعبیه‌شده، فیلدهای اشاره‌گر، یا structهای ناشناس درون‌خطی -- Gin سلسله‌مراتب struct را پیمایش می‌کند و هر تگ `form` را به پارامتر query یا فیلد فرم مربوطه نگاشت می‌کند.

این برای سازماندهی فرم‌های پیچیده در زیرساختارهای قابل استفاده مجدد به‌جای تعریف یک struct تخت با فیلدهای زیاد مفید است.

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

## تست

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
هر سه الگو -- struct تودرتو، اشاره‌گر struct تودرتو، و struct ناشناس درون‌خطی -- با استفاده از همان پارامترهای query تخت متصل می‌شوند. Gin نیازی به هیچ پیشوند یا قرارداد تودرتویی در نام پارامترها ندارد.
:::

## همچنین ببینید

- [اتصال و اعتبارسنجی](/fa/docs/binding/binding-and-validation/)
- [اتصال فرم‌دیتا با تگ struct سفارشی](/fa/docs/binding/bind-form-data-custom-struct-tag/)
