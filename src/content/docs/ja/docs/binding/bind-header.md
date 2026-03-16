---
title: "ヘッダーのバインド"
sidebar:
  order: 9
---

`ShouldBindHeader` は、`header` 構造体タグを使用してHTTPリクエストヘッダーを直接構造体にバインドします。これは、受信リクエストからAPIレート制限、認証トークン、カスタムドメインヘッダーなどのメタデータを抽出する場合に便利です。

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

type testHeader struct {
  Rate   int    `header:"Rate"`
  Domain string `header:"Domain"`
}

func main() {
  r := gin.Default()

  r.GET("/", func(c *gin.Context) {
    h := testHeader{}

    if err := c.ShouldBindHeader(&h); err != nil {
      c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      return
    }

    c.JSON(http.StatusOK, gin.H{"Rate": h.Rate, "Domain": h.Domain})
  })

  r.Run(":8080")
}
```

## テスト

```sh
# Pass custom headers
curl -H "Rate:300" -H "Domain:music" http://localhost:8080/
# Output: {"Domain":"music","Rate":300}

# Missing headers -- zero values are used
curl http://localhost:8080/
# Output: {"Domain":"","Rate":0}
```

:::note
HTTP仕様に基づき、ヘッダー名は大文字小文字を区別しません。`header` 構造体タグの値は大文字小文字を区別せずにマッチングされるため、`header:"Rate"` は `Rate`、`rate`、`RATE` として送信されたヘッダーにマッチします。
:::

:::tip
`header` タグと `binding:"required"` を組み合わせることで、必須ヘッダーが欠落しているリクエストを拒否できます：

```go
type authHeader struct {
  Token string `header:"Authorization" binding:"required"`
}
```

:::

## 関連項目

- [バインドとバリデーション](/ja/docs/binding/binding-and-validation/)
- [クエリ文字列またはポストデータのバインド](/ja/docs/binding/bind-query-or-post/)
