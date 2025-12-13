---
title: الأسئلة الشائعة لـ Method Not Allowed
---

يُرجع Gin الخطأ 404 عندما أصل إلى مسار بطريقة HTTP غير مدعومة. كيف يمكنني جعله يُرجع 405 Method Not Allowed بدلاً من ذلك؟

قم بتكوين الخيار التالي في موجه Gin الخاص بك `r.HandleMethodNotAllowed = true`. سيجعل هذا Gin يُرجع استجابة 405 Method Not Allowed عندما يوجد المسار ولكنه لا يدعم طريقة HTTP المطلوبة:

```go
package main
import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  r := gin.Default()

  r.HandleMethodNotAllowed = true

  r.GET("/ping", func(c *gin.Context) {
    c.JSON(200, gin.H{
      "message": "pong",
    })
  })

  r.Run() // الاستماع والخدمة على 0.0.0.0:8080
}
```

```json
$ curl -X POST localhost:8000/ping

HTTP/1.1 405 Method Not Allowed
Allow: GET
Content-Type: text/plain
Date: Sat, 01 Nov 2025 14:49:36 GMT
Content-Length: 22

405 method not allowed
```
