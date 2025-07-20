---
title: "HTTP/2 伺服器推送"
---

僅 **go1.8+** 支援 http.Pusher。詳情請參閱 [golang 部落格](https://blog.golang.org/h2push)。

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
  <title>Https 測試</title>
  <script src="/assets/app.js"></script>
</head>
<body>
  <h1 style="color:red;">歡迎，Ginner！</h1>
</body>
</html>
`))

func main() {
  router := gin.Default()
  router.Static("/assets", "./assets")
  router.SetHTMLTemplate(html)

  router.GET("/", func(c *gin.Context) {
    if pusher := c.Writer.Pusher(); pusher != nil {
      // 使用 pusher.Push() 進行伺服器推送
      if err := pusher.Push("/assets/app.js", nil); err != nil {
        log.Printf("推送失敗： %v", err)
      }
    }
    c.HTML(200, "https", gin.H{
      "status": "成功",
    })
  })

  // 在 https://127.0.0.1:8080 上監聽並提供服務
  router.RunTLS(":8080", "./testdata/server.pem", "./testdata/server.key")
}
```

