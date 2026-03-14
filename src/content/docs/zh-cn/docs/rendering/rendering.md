---
title: "XML/JSON/YAML/ProtoBuf 渲染"
sidebar:
  order: 1
---

Gin 内置支持以多种格式渲染响应，包括 JSON、XML、YAML 和 Protocol Buffers。这使得构建支持内容协商的 API 变得简单直接——可以以客户端请求的任何格式提供数据。

**何时使用每种格式：**

- **JSON** — REST API 和浏览器客户端最常用的选择。使用 `c.JSON()` 进行标准输出，或使用 `c.IndentedJSON()` 在开发时获得可读性更好的格式。
- **XML** — 在与遗留系统、SOAP 服务或需要 XML 的客户端（如某些企业应用）集成时很有用。
- **YAML** — 适合面向配置的端点或原生使用 YAML 的工具（如 Kubernetes 或 CI/CD 流水线）。
- **ProtoBuf** — 适用于服务之间的高性能、低延迟通信。Protocol Buffers 与文本格式相比，产生更小的有效载荷和更快的序列化速度，但需要共享的 schema 定义（`.proto` 文件）。

所有渲染方法都接受一个 HTTP 状态码和一个数据值。Gin 会序列化数据并自动设置适当的 `Content-Type` 头。

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
  "github.com/gin-gonic/gin/testdata/protoexample"
)

func main() {
  router := gin.Default()

  // gin.H is a shortcut for map[string]interface{}
  router.GET("/someJSON", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{"message": "hey", "status": http.StatusOK})
  })

  router.GET("/moreJSON", func(c *gin.Context) {
    // You also can use a struct
    var msg struct {
      Name    string `json:"user"`
      Message string
      Number  int
    }
    msg.Name = "Lena"
    msg.Message = "hey"
    msg.Number = 123
    // Note that msg.Name becomes "user" in the JSON
    // Will output  :   {"user": "Lena", "Message": "hey", "Number": 123}
    c.JSON(http.StatusOK, msg)
  })

  router.GET("/someXML", func(c *gin.Context) {
    c.XML(http.StatusOK, gin.H{"message": "hey", "status": http.StatusOK})
  })

  router.GET("/someYAML", func(c *gin.Context) {
    c.YAML(http.StatusOK, gin.H{"message": "hey", "status": http.StatusOK})
  })

  router.GET("/someProtoBuf", func(c *gin.Context) {
    reps := []int64{int64(1), int64(2)}
    label := "test"
    // The specific definition of protobuf is written in the testdata/protoexample file.
    data := &protoexample.Test{
      Label: &label,
      Reps:  reps,
    }
    // Note that data becomes binary data in the response
    // Will output protoexample.Test protobuf serialized data
    c.ProtoBuf(http.StatusOK, data)
  })

  // Listen and serve on 0.0.0.0:8080
  router.Run(":8080")
}
```

## 另请参阅

- [PureJSON](/zh-cn/docs/rendering/pure-json/)
- [SecureJSON](/zh-cn/docs/rendering/secure-json/)
- [AsciiJSON](/zh-cn/docs/rendering/ascii-json/)
- [JSONP](/zh-cn/docs/rendering/jsonp/)
