---
title: "从 Reader 提供数据"
sidebar:
  order: 8
---

`DataFromReader` 允许你将任何 `io.Reader` 的数据直接流式传输到 HTTP 响应，而无需先将整个内容缓冲到内存中。这对于构建代理端点或高效地从远程源提供大文件至关重要。

**常见用例：**

- **代理远程资源** — 从外部服务（如云存储 API 或 CDN）获取文件并转发给客户端。数据通过你的服务器流过，而不会完全加载到内存中。
- **提供生成的内容** — 在生产动态生成的数据（如 CSV 导出或报告文件）时进行流式传输。
- **大文件下载** — 提供太大而无法保存在内存中的文件，从磁盘或远程源分块读取。

方法签名为 `c.DataFromReader(code, contentLength, contentType, reader, extraHeaders)`。你需要提供 HTTP 状态码、内容长度（让客户端知道总大小）、MIME 类型、要流式传输的 `io.Reader`，以及可选的额外响应头映射（如用于文件下载的 `Content-Disposition`）。

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

在此示例中，Gin 从 GitHub 获取图片并直接将其作为可下载附件流式传输给客户端。图片字节从上游 HTTP 响应体直接流向客户端响应，而不会在缓冲区中累积。注意 `response.Body` 会在处理函数返回后由 HTTP 服务器自动关闭，因为 `DataFromReader` 在响应写入期间会将其读取完毕。
