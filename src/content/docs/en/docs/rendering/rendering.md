---
title: "XML/JSON/YAML/ProtoBuf rendering"
sidebar:
  order: 1
---

Gin provides built-in support for rendering responses in multiple formats including JSON, XML, YAML, and Protocol Buffers. This makes it straightforward to build APIs that support content negotiation — serving data in whatever format the client requests.

**When to use each format:**

- **JSON** — The most common choice for REST APIs and browser-based clients. Use `c.JSON()` for standard output or `c.IndentedJSON()` for human-readable formatting during development.
- **XML** — Useful when integrating with legacy systems, SOAP services, or clients that expect XML (such as some enterprise applications).
- **YAML** — A good fit for configuration-oriented endpoints or tools that consume YAML natively (such as Kubernetes or CI/CD pipelines).
- **ProtoBuf** — Ideal for high-performance, low-latency communication between services. Protocol Buffers produce smaller payloads and faster serialization compared to text-based formats, but require a shared schema definition (`.proto` file).

All rendering methods accept an HTTP status code and a data value. Gin serializes the data and sets the appropriate `Content-Type` header automatically.

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

## See also

- [PureJSON](/en/docs/rendering/pure-json/)
- [SecureJSON](/en/docs/rendering/secure-json/)
- [AsciiJSON](/en/docs/rendering/ascii-json/)
- [JSONP](/en/docs/rendering/jsonp/)
