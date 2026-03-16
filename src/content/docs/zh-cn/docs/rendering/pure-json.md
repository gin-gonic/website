---
title: "PureJSON"
sidebar:
  order: 5
---

通常，Go 的 `json.Marshal` 会出于安全考虑将特殊 HTML 字符替换为 Unicode 转义序列——例如 `<` 变成 `\u003c`。当将 JSON 嵌入 HTML 时这很好，但如果你正在构建纯 API，客户端可能期望得到原始字符。

`c.PureJSON` 使用 `json.Encoder` 并设置 `SetEscapeHTML(false)`，因此 `<`、`>` 和 `&` 等 HTML 字符会按原样呈现而不会被转义。

当你的 API 消费者期望原始的、未转义的 JSON 时使用 `PureJSON`。当响应可能嵌入 HTML 页面时使用标准的 `JSON`。

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

## 测试

```sh
# Standard JSON -- HTML characters are escaped
curl http://localhost:8080/json
# Output: {"html":"\u003cb\u003eHello, world!\u003c/b\u003e"}

# PureJSON -- HTML characters are literal
curl http://localhost:8080/purejson
# Output: {"html":"<b>Hello, world!</b>"}
```

:::tip
Gin 还提供了 `c.AbortWithStatusPureJSON`（v1.11+），用于在中止中间件链的同时返回未转义的 JSON——这在认证或验证中间件中非常有用。
:::

## 另请参阅

- [AsciiJSON](/zh-cn/docs/rendering/ascii-json/)
- [SecureJSON](/zh-cn/docs/rendering/secure-json/)
- [渲染](/zh-cn/docs/rendering/rendering/)
