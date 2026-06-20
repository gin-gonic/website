---
title: "PureJSON"
sidebar:
  order: 5
---

通常、Goの `json.Marshal` は安全性のために特殊なHTML文字をUnicodeエスケープシーケンスに置き換えます。例えば、`<` は `\u003c` になります。これはJSONをHTMLに埋め込む場合には問題ありませんが、純粋なAPIを構築している場合、クライアントはリテラル文字を期待するかもしれません。

`c.PureJSON` は `json.Encoder` を `SetEscapeHTML(false)` で使用するため、`<`、`>`、`&` などのHTML文字はエスケープされずにそのまま出力されます。

APIの利用者が生の、エスケープされていないJSONを期待する場合は `PureJSON` を使用してください。レスポンスがHTMLページに埋め込まれる可能性がある場合は、標準の `JSON` を使用してください。

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  // Standard JSON -- escapes HTML characters
  router.GET("/json", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{
      "html": "<b>Hello, world!</b>",
    })
  })

  // PureJSON -- serves literal characters
  router.GET("/purejson", func(c *gin.Context) {
    c.PureJSON(http.StatusOK, gin.H{
      "html": "<b>Hello, world!</b>",
    })
  })

  router.Run(":8080")
}
```

## テスト

```sh
# Standard JSON -- HTML characters are escaped
curl http://localhost:8080/json
# Output: {"html":"\u003cb\u003eHello, world!\u003c/b\u003e"}

# PureJSON -- HTML characters are literal
curl http://localhost:8080/purejson
# Output: {"html":"<b>Hello, world!</b>"}
```

:::tip
Ginは `c.AbortWithStatusPureJSON`（v1.11+）も提供しており、ミドルウェアチェーンを中止しながらエスケープされていないJSONを返すことができます。認証やバリデーションミドルウェアで便利です。
:::

## 関連項目

- [AsciiJSON](/ja/docs/rendering/ascii-json/)
- [SecureJSON](/ja/docs/rendering/secure-json/)
- [レンダリング](/ja/docs/rendering/rendering/)
