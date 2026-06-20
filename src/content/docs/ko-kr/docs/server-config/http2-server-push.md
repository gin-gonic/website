---
title: "HTTP2 서버 푸시"
sidebar:
  order: 6
---

> **참고:** HTTP/2 서버 푸시는 주요 브라우저에 의해 지원 중단되었습니다 (Chrome은 2022년에 지원을 제거). 대신 `103 Early Hints` 또는 `<link rel="preload">`를 사용하는 것을 고려하세요. 이 예제는 참고용으로 유지됩니다.

http.Pusher는 **go1.8+**에서만 지원됩니다. 자세한 정보는 [golang 블로그](https://blog.golang.org/h2push)를 참조하세요.

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
      // pusher.Push()를 사용하여 서버 푸시를 수행합니다
      if err := pusher.Push("/assets/app.js", nil); err != nil {
        log.Printf("Failed to push: %v", err)
      }
    }
    c.HTML(200, "https", gin.H{
      "status": "success",
    })
  })

  // https://127.0.0.1:8080에서 수신 대기 및 서비스
  router.RunTLS(":8080", "./testdata/server.pem", "./testdata/server.key")
}
```
