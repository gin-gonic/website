---
title: "使用自定义结构体绑定表单数据请求"
sidebar:
  order: 12
---

Gin 可以自动将表单数据绑定到嵌套结构体中。当你的数据模型由较小的结构体组成时——无论是嵌入字段、指针字段还是匿名内联结构体——Gin 会遍历结构体层次并将每个 `form` 标签映射到相应的查询参数或表单字段。

这对于将复杂表单组织成可重用的子结构非常有用，而不是定义一个包含许多字段的扁平结构体。

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

## 测试

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
所有三种模式——嵌套结构体、嵌套结构体指针和匿名内联结构体——都使用相同的扁平查询参数进行绑定。Gin 不要求参数名称中有任何前缀或嵌套约定。
:::

## 另请参阅

- [绑定和验证](/zh-cn/docs/binding/binding-and-validation/)
- [使用自定义结构体标签绑定表单数据](/zh-cn/docs/binding/bind-form-data-custom-struct-tag/)
