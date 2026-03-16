---
title: "使用自定义结构体标签绑定表单数据"
sidebar:
  order: 14
---

默认情况下，Gin 使用 `form` 结构体标签来绑定表单数据。当你需要绑定一个使用不同标签的结构体时——例如一个你无法修改的外部类型——你可以创建一个自定义绑定来读取你自己的标签。

当集成第三方库时，如果其结构体使用 `url`、`query` 或其他自定义名称而非 `form` 标签，这将非常有用。

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
  "github.com/gin-gonic/gin/binding"
)

const (
  customerTag   = "url"
  defaultMemory = 32 << 20
)

type customerBinding struct{}

func (customerBinding) Name() string {
  return "form"
}

func (customerBinding) Bind(req *http.Request, obj any) error {
  if err := req.ParseForm(); err != nil {
    return err
  }
  if err := req.ParseMultipartForm(defaultMemory); err != nil {
    if err != http.ErrNotMultipart {
      return err
    }
  }
  if err := binding.MapFormWithTag(obj, req.Form, customerTag); err != nil {
    return err
  }
  return validate(obj)
}

func validate(obj any) error {
  if binding.Validator == nil {
    return nil
  }
  return binding.Validator.ValidateStruct(obj)
}

// FormA is an external type that we can't modify its tag
type FormA struct {
  FieldA string `url:"field_a"`
}

func main() {
  router := gin.Default()

  router.GET("/list", func(c *gin.Context) {
    var urlBinding = customerBinding{}
    var opt FormA
    if err := c.MustBindWith(&opt, urlBinding); err != nil {
      return
    }
    c.JSON(http.StatusOK, gin.H{"field_a": opt.FieldA})
  })

  router.Run(":8080")
}
```

## 测试

```sh
# The custom binding reads from the "url" struct tag instead of "form"
curl "http://localhost:8080/list?field_a=hello"
# Output: {"field_a":"hello"}

# Missing parameter -- empty string
curl "http://localhost:8080/list"
# Output: {"field_a":""}
```

:::note
自定义绑定实现了 `binding.Binding` 接口，该接口需要一个 `Name() string` 方法和一个 `Bind(*http.Request, any) error` 方法。`binding.MapFormWithTag` 辅助函数完成了使用自定义标签将表单值映射到结构体字段的实际工作。
:::

## 另请参阅

- [绑定和验证](/zh-cn/docs/binding/binding-and-validation/)
- [使用自定义结构体绑定表单数据请求](/zh-cn/docs/binding/bind-form-data-request-with-custom-struct/)
