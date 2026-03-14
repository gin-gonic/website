---
title: "HTTP2 server push"
sidebar:
  order: 6
---

> **Nota:** HTTP/2 Server Push ha sido descontinuado por los principales navegadores (Chrome eliminó el soporte en 2022). Considera usar `103 Early Hints` o `<link rel="preload">` en su lugar. Este ejemplo se mantiene como referencia.

http.Pusher solo es soportado en **go1.8+**. Consulta el [blog de golang](https://blog.golang.org/h2push) para información detallada.

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

