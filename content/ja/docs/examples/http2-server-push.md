---
title: "HTTP/2 サーバープッシュ"
draft: false
---

http.Pusher は **go1.8+** 以降でのみサポートしています。 詳細な情報は [golang blog](https://blog.golang.org/h2push) を見てください。

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
	r := gin.Default()
	r.Static("/assets", "./assets")
	r.SetHTMLTemplate(html)

	r.GET("/", func(c *gin.Context) {
		if pusher := c.Writer.Pusher(); pusher != nil {
			// サーバープッシュするために pusher.Push() を使う
			if err := pusher.Push("/assets/app.js", nil); err != nil {
				log.Printf("Failed to push: %v", err)
			}
		}
		c.HTML(200, "https", gin.H{
			"status": "success",
		})
	})

	// https://127.0.0.1:8080 でサーバーを立てる
	r.RunTLS(":8080", "./testdata/server.pem", "./testdata/server.key")
}
```


