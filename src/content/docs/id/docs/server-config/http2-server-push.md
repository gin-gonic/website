---
title: "HTTP2 server push"
sidebar:
  order: 6
---

> **Catatan:** HTTP/2 Server Push telah ditinggalkan oleh browser utama (Chrome menghapus dukungan pada 2022). Pertimbangkan menggunakan `103 Early Hints` atau `<link rel="preload">` sebagai gantinya. Contoh ini disimpan untuk referensi.

http.Pusher hanya didukung **go1.8+**. Lihat [blog golang](https://blog.golang.org/h2push) untuk informasi detail.

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

