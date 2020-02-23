---
title: "HTTP2 서버 푸시"
draft: false
---

http.Pusher는 **go1.8 이상**에서만 지원됩니다. 자세한 정보는 [Go언어 블로그](https://blog.golang.org/h2push)에서 확인하세요.

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
			// 서버 푸시를 위해 pusher.Push()를 사용합니다
			if err := pusher.Push("/assets/app.js", nil); err != nil {
				log.Printf("Failed to push: %v", err)
			}
		}
		c.HTML(200, "https", gin.H{
			"status": "success",
		})
	})

	// 서버가 실행 되고 https://127.0.0.1:8080 에서 요청을 기다립니다.
	r.RunTLS(":8080", "./testdata/server.pem", "./testdata/server.key")
}
```

