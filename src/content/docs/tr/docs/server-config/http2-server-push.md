---
title: "HTTP2 sunucu push"
sidebar:
  order: 6
---

> **Not:** HTTP/2 Sunucu Push, büyük tarayıcılar tarafından kullanımdan kaldırılmıştır (Chrome 2022'de desteği kaldırdı). Bunun yerine `103 Early Hints` veya `<link rel="preload">` kullanmayı düşünün. Bu örnek referans olarak tutulmaktadır.

http.Pusher yalnızca **go1.8+** ile desteklenir. Ayrıntılı bilgi için [golang bloguna](https://blog.golang.org/h2push) bakın.

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

