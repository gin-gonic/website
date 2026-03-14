---
title: "Serving data from file"
sidebar:
  order: 7
---

Gin provides several methods for serving files to clients. Each method suits a different use case:

- **`c.File(path)`** -- Serves a file from the local filesystem. The content type is detected automatically. Use this when you know the exact file path at compile time or have already validated it.
- **`c.FileFromFS(path, fs)`** -- Serves a file from an `http.FileSystem` interface. Useful when serving files from embedded filesystems (`embed.FS`), custom storage backends, or when you want to restrict access to a specific directory tree.
- **`c.FileAttachment(path, filename)`** -- Serves a file as a download by setting the `Content-Disposition: attachment` header. The browser will prompt the user to save the file using the filename you provide, regardless of the original file name on disk.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  // Serve a file inline (displayed in browser)
  router.GET("/local/file", func(c *gin.Context) {
    c.File("local/file.go")
  })

  // Serve a file from an http.FileSystem
  var fs http.FileSystem = http.Dir("/var/www/assets")
  router.GET("/fs/file", func(c *gin.Context) {
    c.FileFromFS("fs/file.go", fs)
  })

  // Serve a file as a downloadable attachment with a custom filename
  router.GET("/download", func(c *gin.Context) {
    c.FileAttachment("local/report-2024-q1.xlsx", "quarterly-report.xlsx")
  })

  router.Run(":8080")
}
```

You can test the download endpoint with curl:

```sh
# The -v flag shows the Content-Disposition header
curl -v http://localhost:8080/download --output report.xlsx

# Serve a file inline
curl http://localhost:8080/local/file
```

For streaming data from an `io.Reader` (such as a remote URL or dynamically generated content), use `c.DataFromReader()` instead. See [Serving data from reader](/en/docs/rendering/serving-data-from-reader/) for details.

:::caution[Security: path traversal]
Never pass user input directly to `c.File()` or `c.FileAttachment()`. An attacker could supply a path like `../../etc/passwd` to read arbitrary files on your server. Always validate and sanitize file paths, or use `c.FileFromFS()` with a restricted `http.FileSystem` that confines access to a specific directory.

```go
// DANGEROUS -- never do this
router.GET("/files/:name", func(c *gin.Context) {
  c.File(c.Param("name")) // attacker controls the path
})

// SAFE -- restrict to a specific directory
var safeFS http.FileSystem = http.Dir("/var/www/public")
router.GET("/files/:name", func(c *gin.Context) {
  c.FileFromFS(c.Param("name"), safeFS)
})
```
:::
