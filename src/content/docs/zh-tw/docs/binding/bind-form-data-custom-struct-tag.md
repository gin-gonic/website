---
title: "使用自訂結構體標籤綁定表單資料"
sidebar:
  order: 14
---

預設情況下，Gin 使用 `form` 結構體標籤來綁定表單資料。當你需要綁定一個使用不同標籤的結構體時——例如一個你無法修改的外部型別——你可以建立一個從你自訂標籤讀取的自訂綁定。

這在整合第三方函式庫時很有用，這些函式庫的結構體使用 `url`、`query` 或其他自訂名稱而非 `form` 作為標籤。

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

## 測試

```sh
# The custom binding reads from the "url" struct tag instead of "form"
curl "http://localhost:8080/list?field_a=hello"
# Output: {"field_a":"hello"}

# Missing parameter -- empty string
curl "http://localhost:8080/list"
# Output: {"field_a":""}
```

:::note
自訂綁定實作了 `binding.Binding` 介面，該介面需要一個 `Name() string` 方法和一個 `Bind(*http.Request, any) error` 方法。`binding.MapFormWithTag` 輔助函式負責使用你的自訂標籤將表單值對應到結構體欄位。
:::

## 另請參閱

- [綁定與驗證](/zh-tw/docs/binding/binding-and-validation/)
- [使用自訂結構體綁定表單資料請求](/zh-tw/docs/binding/bind-form-data-request-with-custom-struct/)
