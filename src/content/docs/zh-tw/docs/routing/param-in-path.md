---
title: "路徑參數"
sidebar:
  order: 2
---

Gin 支援兩種類型的路徑參數，讓你可以直接從 URL 中擷取值：

- **`:name`** —— 匹配單一路徑段。例如，`/user/:name` 匹配 `/user/john`，但**不**匹配 `/user/` 或 `/user`。
- **`*action`** —— 匹配前綴之後的所有內容，包括斜線。例如，`/user/:name/*action` 匹配 `/user/john/send` 和 `/user/john/`。擷取的值包含前導 `/`。

使用 `c.Param("name")` 在處理器中取得路徑參數的值。

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  // This handler will match /user/john but will not match /user/ or /user
  router.GET("/user/:name", func(c *gin.Context) {
    name := c.Param("name")
    c.String(http.StatusOK, "Hello %s", name)
  })

  // However, this one will match /user/john/ and also /user/john/send
  // If no other routers match /user/john, it will redirect to /user/john/
  router.GET("/user/:name/*action", func(c *gin.Context) {
    name := c.Param("name")
    action := c.Param("action")
    message := name + " is " + action
    c.String(http.StatusOK, message)
  })

  router.Run(":8080")
}
```

## 測試

```sh
# Single parameter -- matches :name
curl http://localhost:8080/user/john
# Output: Hello john

# Wildcard parameter -- matches :name and *action
curl http://localhost:8080/user/john/send
# Output: john is /send

# Trailing slash is captured by the wildcard
curl http://localhost:8080/user/john/
# Output: john is /
```

:::note
萬用字元 `*action` 的值始終包含前導 `/`。在上面的範例中，`c.Param("action")` 回傳 `/send`，而不是 `send`。
:::

:::caution
如果 `/user/:name` 和 `/user/:name/*action` 在相同的路徑深度產生衝突，你無法同時定義兩者。如果 Gin 偵測到有歧義的路由，會在啟動時觸發 panic。
:::

## 另請參閱

- [查詢字串參數](/zh-tw/docs/routing/querystring-param/)
- [查詢與 POST 表單](/zh-tw/docs/routing/query-and-post-form/)
