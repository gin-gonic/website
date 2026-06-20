---
title: "PureJSON"
sidebar:
  order: 5
---

通常，Go 的 `json.Marshal` 會為了安全性將特殊 HTML 字元替換為 Unicode 跳脫序列——例如 `<` 會變成 `\u003c`。當 JSON 嵌入 HTML 時這沒問題，但如果你正在建構純 API，客戶端可能期望收到原始字元。

`c.PureJSON` 使用 `json.Encoder` 並設定 `SetEscapeHTML(false)`，因此 HTML 字元如 `<`、`>` 和 `&` 會以原始字元呈現，而不是被跳脫。

當你的 API 消費者期望原始、未跳脫的 JSON 時，請使用 `PureJSON`。當回應可能嵌入 HTML 頁面時，請使用標準的 `JSON`。

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

## 測試

```sh
# Standard JSON -- HTML characters are escaped
curl http://localhost:8080/json
# Output: {"html":"\u003cb\u003eHello, world!\u003c/b\u003e"}

# PureJSON -- HTML characters are literal
curl http://localhost:8080/purejson
# Output: {"html":"<b>Hello, world!</b>"}
```

:::tip
Gin 也提供 `c.AbortWithStatusPureJSON`（v1.11+），用於在中止中介軟體鏈的同時回傳未跳脫的 JSON——適用於驗證或認證中介軟體。
:::

## 另請參閱

- [AsciiJSON](/zh-tw/docs/rendering/ascii-json/)
- [SecureJSON](/zh-tw/docs/rendering/secure-json/)
- [渲染](/zh-tw/docs/rendering/rendering/)
