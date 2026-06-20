---
title: "路由"
sidebar:
  order: 3
---

Gin 提供了基于 [httprouter](https://github.com/julienschmidt/httprouter) 构建的强大路由系统，用于高性能的 URL 匹配。在底层，httprouter 使用[基数树](https://en.wikipedia.org/wiki/Radix_tree)（也称为压缩字典树）来存储和查找路由，这意味着路由匹配非常快速，每次查找零内存分配。这使得 Gin 成为最快的 Go Web 框架之一。

通过在引擎（或路由组）上调用 HTTP 方法并提供 URL 模式和一个或多个处理函数来注册路由：

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.GET("/hello", func(c *gin.Context) {
    c.String(http.StatusOK, "Hello, World!")
  })

  router.POST("/users", func(c *gin.Context) {
    name := c.PostForm("name")
    c.JSON(http.StatusCreated, gin.H{"user": name})
  })

  router.Run(":8080")
}
```

## 本节内容

以下页面详细介绍了每个路由主题：

- [**使用 HTTP 方法**](./http-method/) -- 注册 GET、POST、PUT、DELETE、PATCH、HEAD 和 OPTIONS 路由。
- [**路径参数**](./param-in-path/) -- 从 URL 路径中捕获动态段（例如 `/user/:name`）。
- [**查询字符串参数**](./querystring-param/) -- 从请求 URL 中读取查询字符串值。
- [**查询字符串和表单**](./query-and-post-form/) -- 在同一处理函数中访问查询字符串和 POST 表单数据。
- [**Map 作为查询字符串或表单参数**](./map-as-querystring-or-postform/) -- 从查询字符串或 POST 表单中绑定 map 参数。
- [**Multipart/urlencoded 表单**](./multipart-urlencoded-form/) -- 解析 `multipart/form-data` 和 `application/x-www-form-urlencoded` 请求体。
- [**文件上传**](./upload-file/) -- 处理单文件和多文件上传。
- [**路由分组**](./grouping-routes/) -- 在共享前缀和公共中间件下组织路由。
- [**重定向**](./redirects/) -- 执行 HTTP 重定向和路由级别重定向。
