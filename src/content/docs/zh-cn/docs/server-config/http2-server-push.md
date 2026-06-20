---
title: "HTTP/2 服务器推送"
sidebar:
  order: 6
---

> **注意：** HTTP/2 服务器推送已被主流浏览器弃用（Chrome 在 2022 年移除了支持）。考虑改用 `103 Early Hints` 或 `<link rel="preload">`。此示例仅供参考。

http.Pusher 仅在 **go1.8+** 版本中支持。详细信息请参阅 [golang 博客](https://blog.golang.org/h2push)。

```go
package main

import (
  "html/template"
  "log"

  "github.com/gin-gonic/gin"
)

var html = template.Must(template.New("https").Parse(`
<html>
<head>
  <title>Https Test</title>
  <script src="/assets/app.js"></script>
</head>
<body>
  <h1 style="color:red;">Welcome, Ginner!</h1>
</body>
</html>
`))

func main() {
  router := gin.Default()
  router.Static("/assets", "./assets")
  router.SetHTMLTemplate(html)

  router.GET("/", func(c *gin.Context) {
    if pusher := c.Writer.Pusher(); pusher != nil {
      // use pusher.Push() to do server push
      if err := pusher.Push("/assets/app.js", nil); err != nil {
        log.Printf("Failed to push: %v", err)
      }
    }
    c.HTML(200, "https", gin.H{
      "status": "success",
    })
  })

  // Listen and Serve in https://127.0.0.1:8080
  router.RunTLS(":8080", "./testdata/server.pem", "./testdata/server.key")
}
```
