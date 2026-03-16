---
title: "カスタム構造体タグを使用したフォームデータのバインド"
sidebar:
  order: 14
---

デフォルトでは、Ginはフォームデータのバインドに `form` 構造体タグを使用します。異なるタグを使用する構造体をバインドする必要がある場合（例えば、変更できない外部の型など）、独自のタグから読み取るカスタムバインディングを作成できます。

これは、`form` の代わりに `url`、`query`、またはその他のカスタム名のタグを使用するサードパーティライブラリと統合する場合に便利です。

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

## テスト

```sh
# The custom binding reads from the "url" struct tag instead of "form"
curl "http://localhost:8080/list?field_a=hello"
# Output: {"field_a":"hello"}

# Missing parameter -- empty string
curl "http://localhost:8080/list"
# Output: {"field_a":""}
```

:::note
カスタムバインディングは `binding.Binding` インターフェースを実装しており、`Name() string` メソッドと `Bind(*http.Request, any) error` メソッドが必要です。`binding.MapFormWithTag` ヘルパーが、カスタムタグを使用してフォームの値を構造体のフィールドにマッピングする実際の処理を行います。
:::

## 関連項目

- [バインドとバリデーション](/ja/docs/binding/binding-and-validation/)
- [カスタム構造体を使用したフォームデータリクエストのバインド](/ja/docs/binding/bind-form-data-request-with-custom-struct/)
