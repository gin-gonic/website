---
title: "ربط طلب بيانات النموذج بهيكل مخصص"
sidebar:
  order: 12
---

يمكن لـ Gin ربط بيانات النموذج بالهياكل المتداخلة تلقائياً. عندما يتكون نموذج البيانات الخاص بك من هياكل أصغر — سواء كحقول مضمّنة أو حقول مؤشرات أو هياكل مضمّنة مجهولة — يتنقل Gin عبر تسلسل الهياكل ويربط كل علامة `form` بمعامل الاستعلام أو حقل النموذج المقابل.

هذا مفيد لتنظيم النماذج المعقدة في هياكل فرعية قابلة لإعادة الاستخدام بدلاً من تعريف هيكل مسطح واحد بحقول كثيرة.

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

## اختبره

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
جميع الأنماط الثلاثة — الهيكل المتداخل، ومؤشر الهيكل المتداخل، والهيكل المضمّن المجهول — يتم ربطها باستخدام نفس معاملات الاستعلام المسطحة. لا يتطلب Gin أي بادئة أو اصطلاح تداخل في أسماء المعاملات.
:::

## انظر أيضاً

- [الربط والتحقق](/ar/docs/binding/binding-and-validation/)
- [ربط بيانات النموذج بعلامة هيكل مخصصة](/ar/docs/binding/bind-form-data-custom-struct-tag/)
