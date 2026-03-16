---
title: "ボディを異なる構造体にバインドする"
sidebar:
  order: 13
---

`c.ShouldBind` のような標準的なバインドメソッドは `c.Request.Body` を消費します。これは `io.ReadCloser` であり、一度読み取ると再度読み取ることはできません。つまり、同じリクエストに対して異なる構造体の形状を試すために `c.ShouldBind` を複数回呼び出すことはできません。

この問題を解決するには、`c.ShouldBindBodyWith` を使用します。これはボディを一度読み取り、コンテキストに保存するため、後続のバインドでキャッシュされたボディを再利用できます。

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
  "github.com/gin-gonic/gin/binding"
)

type formA struct {
  Foo string `json:"foo" xml:"foo" binding:"required"`
}

type formB struct {
  Bar string `json:"bar" xml:"bar" binding:"required"`
}

func main() {
  router := gin.Default()

  router.POST("/bind", func(c *gin.Context) {
    objA := formA{}
    objB := formB{}
    // This reads c.Request.Body and stores the result into the context.
    if errA := c.ShouldBindBodyWith(&objA, binding.JSON); errA == nil {
      c.JSON(http.StatusOK, gin.H{"message": "matched formA", "foo": objA.Foo})
      return
    }
    // At this time, it reuses body stored in the context.
    if errB := c.ShouldBindBodyWith(&objB, binding.JSON); errB == nil {
      c.JSON(http.StatusOK, gin.H{"message": "matched formB", "bar": objB.Bar})
      return
    }

    c.JSON(http.StatusBadRequest, gin.H{"error": "request body did not match any known format"})
  })

  router.Run(":8080")
}
```

## テスト

```sh
# Body matches formA
curl -X POST http://localhost:8080/bind \
  -H "Content-Type: application/json" \
  -d '{"foo":"hello"}'
# Output: {"foo":"hello","message":"matched formA"}

# Body matches formB
curl -X POST http://localhost:8080/bind \
  -H "Content-Type: application/json" \
  -d '{"bar":"world"}'
# Output: {"bar":"world","message":"matched formB"}
```

:::note
`c.ShouldBindBodyWith` はバインド前にボディをコンテキストに保存します。これにはわずかなパフォーマンスへの影響があるため、ボディを複数回バインドする必要がある場合にのみ使用してください。`Query`、`Form`、`FormPost`、`FormMultipart` など、ボディを読み取らない形式の場合は、問題なく `c.ShouldBind()` を複数回呼び出すことができます。
:::

## 関連項目

- [バインドとバリデーション](/ja/docs/binding/binding-and-validation/)
- [クエリ文字列またはポストデータのバインド](/ja/docs/binding/bind-query-or-post/)
