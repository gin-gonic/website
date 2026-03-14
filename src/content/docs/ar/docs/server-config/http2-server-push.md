---
title: "دفع خادم HTTP2"
sidebar:
  order: 6
---

> **ملاحظة:** تم إهمال دفع خادم HTTP/2 من قبل المتصفحات الرئيسية (أزال Chrome الدعم في 2022). فكر في استخدام `103 Early Hints` أو `<link rel="preload">` بدلاً من ذلك. هذا المثال محفوظ للمرجع.

http.Pusher مدعوم فقط في **go1.8+**. راجع [مدونة golang](https://blog.golang.org/h2push) لمعلومات تفصيلية.

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

