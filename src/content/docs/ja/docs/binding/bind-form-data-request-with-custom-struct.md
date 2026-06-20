---
title: "カスタム構造体を使用したフォームデータリクエストのバインド"
sidebar:
  order: 12
---

Ginはフォームデータをネストされた構造体に自動的にバインドできます。データモデルが小さな構造体で構成されている場合（埋め込みフィールド、ポインタフィールド、または匿名インライン構造体として）、Ginは構造体の階層を走査し、各 `form` タグを対応するクエリパラメータまたはフォームフィールドにマッピングします。

これは、多くのフィールドを持つ1つのフラットな構造体を定義するのではなく、複雑なフォームを再利用可能なサブ構造体に整理する場合に便利です。

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

## テスト

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
ネストされた構造体、ネストされた構造体ポインタ、匿名インライン構造体の3つのパターンすべてが、同じフラットなクエリパラメータを使用してバインドされます。Ginはパラメータ名にプレフィックスやネストの規則を必要としません。
:::

## 関連項目

- [バインドとバリデーション](/ja/docs/binding/binding-and-validation/)
- [カスタム構造体タグを使用したフォームデータのバインド](/ja/docs/binding/bind-form-data-custom-struct-tag/)
