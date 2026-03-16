---
title: "重定向"
sidebar:
  order: 9
---

Gin 支持 HTTP 重定向（将客户端发送到不同的 URL）和路由器重定向（在服务器内部将请求转发到不同的处理函数，无需客户端往返）。

## HTTP 重定向

使用 `c.Redirect` 配合适当的 HTTP 状态码来重定向客户端：

- **301 (`http.StatusMovedPermanently`)** —— 资源已永久移动。浏览器和搜索引擎会更新它们的缓存。
- **302 (`http.StatusFound`)** —— 临时重定向。浏览器会跟随但不会缓存新 URL。
- **307 (`http.StatusTemporaryRedirect`)** —— 类似 302，但浏览器必须保留原始 HTTP 方法（对 POST 重定向有用）。
- **308 (`http.StatusPermanentRedirect`)** —— 类似 301，但浏览器必须保留原始 HTTP 方法。

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  // External redirect (GET)
  router.GET("/old", func(c *gin.Context) {
    c.Redirect(http.StatusMovedPermanently, "https://www.google.com/")
  })

  // Redirect from POST -- use 302 or 307 to preserve behavior
  router.POST("/submit", func(c *gin.Context) {
    c.Redirect(http.StatusFound, "/result")
  })

  // Internal router redirect (no HTTP round-trip)
  router.GET("/test", func(c *gin.Context) {
    c.Request.URL.Path = "/final"
    router.HandleContext(c)
  })

  router.GET("/final", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{"hello": "world"})
  })

  router.GET("/result", func(c *gin.Context) {
    c.String(http.StatusOK, "Redirected here!")
  })

  router.Run(":8080")
}
```

## 测试

```sh
# GET redirect -- follows to Google (use -L to follow, -I to see headers only)
curl -I http://localhost:8080/old
# Output includes: HTTP/1.1 301 Moved Permanently
# Output includes: Location: https://www.google.com/

# POST redirect -- returns 302 with new location
curl -X POST -I http://localhost:8080/submit
# Output includes: HTTP/1.1 302 Found
# Output includes: Location: /result

# Internal redirect -- handled server-side, client sees final response
curl http://localhost:8080/test
# Output: {"hello":"world"}
```

:::caution
从 POST 处理函数重定向时，请使用 `302` 或 `307` 而不是 `301`。`301` 重定向可能导致某些浏览器将方法从 POST 更改为 GET，这会导致意外行为。
:::

:::tip
通过 `router.HandleContext(c)` 进行的内部重定向不会向客户端发送重定向响应。请求在服务器内部重新路由，这更快且对客户端透明。
:::

## 另请参阅

- [路由分组](/zh-cn/docs/routing/grouping-routes/)
