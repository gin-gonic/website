---
title: "查询字符串和表单"
sidebar:
  order: 5
---

处理 `POST` 请求时，你通常需要同时从 URL 查询字符串和请求体中读取值。Gin 将这两个数据源分开，因此你可以独立访问每一个：

- `c.Query("key")` / `c.DefaultQuery("key", "default")` —— 从 URL 查询字符串读取。
- `c.PostForm("key")` / `c.DefaultPostForm("key", "default")` —— 从 `application/x-www-form-urlencoded` 或 `multipart/form-data` 请求体读取。

这在 REST API 中很常见，路由通过查询参数（如 `id`）标识资源，而请求体携带有效负载（如 `name` 和 `message`）。

```go
package main

import (
  "fmt"
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.POST("/post", func(c *gin.Context) {
    id := c.Query("id")
    page := c.DefaultQuery("page", "0")
    name := c.PostForm("name")
    message := c.PostForm("message")

    fmt.Printf("id: %s; page: %s; name: %s; message: %s\n", id, page, name, message)
    c.String(http.StatusOK, "id: %s; page: %s; name: %s; message: %s", id, page, name, message)
  })

  router.Run(":8080")
}
```

## 测试

```sh
# Query params in URL, form data in body
curl -X POST "http://localhost:8080/post?id=1234&page=1" \
  -d "name=manu&message=this_is_great"
# Output: id: 1234; page: 1; name: manu; message: this_is_great

# Missing page -- falls back to default value "0"
curl -X POST "http://localhost:8080/post?id=1234" \
  -d "name=manu&message=hello"
# Output: id: 1234; page: 0; name: manu; message: hello
```

:::note
`c.Query` 仅从 URL 查询字符串读取，`c.PostForm` 仅从请求体读取。它们不会交叉读取。如果你希望 Gin 自动检查两个数据源，请改用 `c.ShouldBind` 配合结构体。
:::

## 另请参阅

- [查询字符串参数](/zh-cn/docs/routing/querystring-param/)
- [Map 作为查询字符串或表单参数](/zh-cn/docs/routing/map-as-querystring-or-postform/)
- [Multipart/Urlencoded 表单](/zh-cn/docs/routing/multipart-urlencoded-form/)
