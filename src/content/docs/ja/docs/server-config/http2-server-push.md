---
title: "HTTP2サーバープッシュ"
sidebar:
  order: 6
---

> **注意：** HTTP/2サーバープッシュは主要なブラウザで非推奨になりました（Chromeは2022年にサポートを削除）。代わりに`103 Early Hints`や`<link rel="preload">`の使用を検討してください。この例は参考のために残されています。

http.Pusherは**go1.8+**でのみサポートされています。詳細は[Golangブログ](https://blog.golang.org/h2push)を参照してください。

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
      // pusher.Push()でサーバープッシュを実行
      if err := pusher.Push("/assets/app.js", nil); err != nil {
        log.Printf("Failed to push: %v", err)
      }
    }
    c.HTML(200, "https", gin.H{
      "status": "success",
    })
  })

  // https://127.0.0.1:8080でリッスンしてサーブ
  router.RunTLS(":8080", "./testdata/server.pem", "./testdata/server.key")
}
```
