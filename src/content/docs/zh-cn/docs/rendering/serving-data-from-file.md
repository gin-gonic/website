---
title: "从文件提供数据"
sidebar:
  order: 7
---

Gin 提供了多种方法来向客户端提供文件。每种方法适用于不同的用例：

- **`c.File(path)`** -- 从本地文件系统提供文件。内容类型会自动检测。当你在编译时已知确切的文件路径或已验证过路径时使用。
- **`c.FileFromFS(path, fs)`** -- 从 `http.FileSystem` 接口提供文件。适用于从嵌入式文件系统（`embed.FS`）、自定义存储后端提供文件，或当你想限制对特定目录树的访问时。
- **`c.FileAttachment(path, filename)`** -- 通过设置 `Content-Disposition: attachment` 头将文件作为下载提供。浏览器会提示用户使用你提供的文件名保存文件，而不管磁盘上的原始文件名。

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

你可以使用 curl 测试下载端点：

```sh
# The -v flag shows the Content-Disposition header
curl -v http://localhost:8080/download --output report.xlsx

# Serve a file inline
curl http://localhost:8080/local/file
```

如需从 `io.Reader` 流式传输数据（如远程 URL 或动态生成的内容），请改用 `c.DataFromReader()`。详情请参阅[从 Reader 提供数据](/zh-cn/docs/rendering/serving-data-from-reader/)。

:::caution[安全：路径遍历]
永远不要将用户输入直接传递给 `c.File()` 或 `c.FileAttachment()`。攻击者可以提供 `../../etc/passwd` 之类的路径来读取服务器上的任意文件。始终验证和清理文件路径，或使用带有受限 `http.FileSystem` 的 `c.FileFromFS()` 来将访问限制在特定目录中。

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
