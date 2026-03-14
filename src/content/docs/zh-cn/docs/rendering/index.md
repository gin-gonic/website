---
title: "渲染"
sidebar:
  order: 5
---

Gin 支持以多种格式渲染响应，包括 JSON、XML、YAML、ProtoBuf、HTML 等。每种渲染方法都遵循相同的模式：在 `*gin.Context` 上调用一个方法，传入 HTTP 状态码和要序列化的数据。Gin 会自动处理 Content-Type 头、序列化和写入响应。

```go
// All rendering methods share this pattern:
c.JSON(http.StatusOK, data)   // application/json
c.XML(http.StatusOK, data)    // application/xml
c.YAML(http.StatusOK, data)   // application/x-yaml
c.TOML(http.StatusOK, data)   // application/toml
c.ProtoBuf(http.StatusOK, data) // application/x-protobuf
```

你可以使用 `Accept` 头或查询参数，在单个处理函数中以多种格式提供相同的数据：

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.GET("/user", func(c *gin.Context) {
    user := gin.H{"name": "Lena", "role": "admin"}

    switch c.Query("format") {
    case "xml":
      c.XML(http.StatusOK, user)
    case "yaml":
      c.YAML(http.StatusOK, user)
    default:
      c.JSON(http.StatusOK, user)
    }
  })

  router.Run(":8080")
}
```

## 本节内容

- [**XML/JSON/YAML/ProtoBuf 渲染**](./rendering/) -- 以多种格式渲染响应，自动处理内容类型
- [**SecureJSON**](./secure-json/) -- 防止旧浏览器中的 JSON 劫持攻击
- [**JSONP**](./jsonp/) -- 支持无 CORS 情况下旧客户端的跨域请求
- [**AsciiJSON**](./ascii-json/) -- 转义非 ASCII 字符以确保安全传输
- [**PureJSON**](./pure-json/) -- 渲染 JSON 时不转义 HTML 字符
- [**提供静态文件**](./serving-static-files/) -- 提供静态资源目录
- [**从文件提供数据**](./serving-data-from-file/) -- 提供单个文件、附件和下载
- [**从 Reader 提供数据**](./serving-data-from-reader/) -- 从任意 `io.Reader` 流式传输数据到响应
- [**HTML 渲染**](./html-rendering/) -- 使用动态数据渲染 HTML 模板
- [**多模板**](./multiple-template/) -- 在单个应用中使用多个模板集
- [**将模板绑定到单一二进制文件**](./bind-single-binary-with-template/) -- 将模板嵌入编译后的二进制文件
