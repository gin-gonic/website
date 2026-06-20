---
title: "Rendering"
sidebar:
  order: 5
---

Gin supports rendering responses in multiple formats including JSON, XML, YAML, ProtoBuf, HTML, and more. Every rendering method follows the same pattern: call a method on `*gin.Context` with an HTTP status code and the data to serialize. Gin handles content-type headers, serialization, and writing the response automatically.

```go
// All rendering methods share this pattern:
c.JSON(http.StatusOK, data)   // application/json
c.XML(http.StatusOK, data)    // application/xml
c.YAML(http.StatusOK, data)   // application/x-yaml
c.TOML(http.StatusOK, data)   // application/toml
c.ProtoBuf(http.StatusOK, data) // application/x-protobuf
```

You can use the `Accept` header or a query parameter to serve the same data in multiple formats from a single handler:

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

## In this section

- [**XML/JSON/YAML/ProtoBuf rendering**](./rendering/) -- Render responses in multiple formats with automatic content-type handling
- [**SecureJSON**](./secure-json/) -- Prevent JSON hijacking attacks in legacy browsers
- [**JSONP**](./jsonp/) -- Support cross-domain requests from legacy clients without CORS
- [**AsciiJSON**](./ascii-json/) -- Escape non-ASCII characters for safe transport
- [**PureJSON**](./pure-json/) -- Render JSON without escaping HTML characters
- [**Serving static files**](./serving-static-files/) -- Serve directories of static assets
- [**Serving data from file**](./serving-data-from-file/) -- Serve individual files, attachments, and downloads
- [**Serving data from reader**](./serving-data-from-reader/) -- Stream data from any `io.Reader` to the response
- [**HTML rendering**](./html-rendering/) -- Render HTML templates with dynamic data
- [**Multiple templates**](./multiple-template/) -- Use multiple template sets in a single application
- [**Bind single binary with template**](./bind-single-binary-with-template/) -- Embed templates into your compiled binary
