---
title: "使用自訂結構體綁定表單資料請求"
sidebar:
  order: 12
---

Gin 可以自動將表單資料綁定到巢狀結構體。當你的資料模型由較小的結構體組成時——無論是嵌入欄位、指標欄位還是匿名內嵌結構體——Gin 會遍歷結構體層次結構，並將每個 `form` 標籤對應到相應的查詢參數或表單欄位。

這對於將複雜表單組織成可重複使用的子結構很有用，而不是定義一個包含許多欄位的扁平結構體。

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

## 測試

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
以上三種模式——巢狀結構體、巢狀結構體指標和匿名內嵌結構體——都使用相同的扁平查詢參數進行綁定。Gin 不需要在參數名稱中使用任何前綴或巢狀慣例。
:::

## 另請參閱

- [綁定與驗證](/zh-tw/docs/binding/binding-and-validation/)
- [使用自訂結構體標籤綁定表單資料](/zh-tw/docs/binding/bind-form-data-custom-struct-tag/)
