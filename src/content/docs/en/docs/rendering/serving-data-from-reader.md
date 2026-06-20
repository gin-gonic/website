---
title: "Serving data from reader"
sidebar:
  order: 8
---

`DataFromReader` lets you stream data from any `io.Reader` directly to the HTTP response without buffering the entire content in memory first. This is essential for building proxy endpoints or serving large files from remote sources efficiently.

**Common use cases:**

- **Proxying remote resources** — Fetching a file from an external service (such as a cloud storage API or CDN) and forwarding it to the client. The data flows through your server without being fully loaded into memory.
- **Serving generated content** — Streaming dynamically generated data (such as CSV exports or report files) as it is produced.
- **Large file downloads** — Serving files that are too large to hold in memory, by reading them in chunks from disk or from a remote source.

The method signature is `c.DataFromReader(code, contentLength, contentType, reader, extraHeaders)`. You provide the HTTP status code, the content length (so the client knows the total size), the MIME type, the `io.Reader` to stream from, and an optional map of extra response headers (such as `Content-Disposition` for file downloads).

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()
  router.GET("/someDataFromReader", func(c *gin.Context) {
    response, err := http.Get("https://raw.githubusercontent.com/gin-gonic/logo/master/color.png")
    if err != nil || response.StatusCode != http.StatusOK {
      c.Status(http.StatusServiceUnavailable)
      return
    }

    reader := response.Body
    contentLength := response.ContentLength
    contentType := response.Header.Get("Content-Type")

    extraHeaders := map[string]string{
      "Content-Disposition": `attachment; filename="gopher.png"`,
    }

    c.DataFromReader(http.StatusOK, contentLength, contentType, reader, extraHeaders)
  })
  router.Run(":8080")
}
```

In this example, Gin fetches an image from GitHub and streams it directly to the client as a downloadable attachment. The image bytes flow from the upstream HTTP response body through to the client response without being accumulated in a buffer. Note that `response.Body` is automatically closed by the HTTP server after the handler returns, since `DataFromReader` reads it to completion during the response write.
