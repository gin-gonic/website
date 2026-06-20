---
title: "绑定请求头"
sidebar:
  order: 9
---

`ShouldBindHeader` 使用 `header` 结构体标签将 HTTP 请求头直接绑定到结构体中。这对于从传入请求中提取元数据（如 API 速率限制、认证令牌或自定义域头信息）非常有用。

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

## 测试

```sh
# Pass custom headers
curl -H "Rate:300" -H "Domain:music" http://localhost:8080/
# Output: {"Domain":"music","Rate":300}

# Missing headers -- zero values are used
curl http://localhost:8080/
# Output: {"Domain":"","Rate":0}
```

:::note
根据 HTTP 规范，请求头名称不区分大小写。`header` 结构体标签值会进行不区分大小写的匹配，因此 `header:"Rate"` 将匹配以 `Rate`、`rate` 或 `RATE` 发送的请求头。
:::

:::tip
你可以将 `header` 标签与 `binding:"required"` 结合使用，以拒绝缺少必需请求头的请求：

```go
type authHeader struct {
  Token string `header:"Authorization" binding:"required"`
}
```

:::

## 另请参阅

- [绑定和验证](/zh-cn/docs/binding/binding-and-validation/)
- [绑定查询字符串或 POST 数据](/zh-cn/docs/binding/bind-query-or-post/)
