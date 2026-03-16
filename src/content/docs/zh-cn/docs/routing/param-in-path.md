---
title: "路径参数"
sidebar:
  order: 2
---

Gin 支持两种类型的路径参数，让你可以直接从 URL 中捕获值：

- **`:name`** —— 匹配单个路径段。例如，`/user/:name` 匹配 `/user/john`，但**不**匹配 `/user/` 或 `/user`。
- **`*action`** —— 匹配前缀之后的所有内容，包括斜杠。例如，`/user/:name/*action` 匹配 `/user/john/send` 和 `/user/john/`。捕获的值包含前导 `/`。

在处理函数内使用 `c.Param("name")` 来获取路径参数的值。

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

## 测试

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
通配符 `*action` 的值始终包含前导 `/`。在上面的示例中，`c.Param("action")` 返回 `/send`，而不是 `send`。
:::

:::caution
如果 `/user/:name` 和 `/user/:name/*action` 在相同路径深度产生冲突，则不能同时定义它们。如果 Gin 检测到歧义路由，将在启动时 panic。
:::

## 另请参阅

- [查询字符串参数](/zh-cn/docs/routing/querystring-param/)
- [查询字符串和表单](/zh-cn/docs/routing/query-and-post-form/)
