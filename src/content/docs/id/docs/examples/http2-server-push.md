---
title: "HTTP2 server push"
---

`http.Pusher` hanya didukung pada **go1.8+**. Lihat [blog golang](https://blog.golang.org/h2push) untuk informasi detail.

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
      // gunakan pusher.Push() untuk melakukan server push
      if err := pusher.Push("/assets/app.js", nil); err != nil {
        log.Printf("Failed to push: %v", err)
      }
    }
    c.HTML(200, "https", gin.H{
      "status": "success",
    })
  })

  // jalankan server pada https://127.0.0.1:8080
  router.RunTLS(":8080", "./testdata/server.pem", "./testdata/server.key")
}
```