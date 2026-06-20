---
title: "الاستعلام ونموذج الإرسال"
sidebar:
  order: 5
---

عند معالجة طلب `POST`، غالباً ما تحتاج لقراءة القيم من كل من سلسلة استعلام URL وجسم الطلب. يحتفظ Gin بهذين المصدرين منفصلين، بحيث يمكنك الوصول إلى كل منهما بشكل مستقل:

- `c.Query("key")` / `c.DefaultQuery("key", "default")` — يقرأ من سلسلة استعلام URL.
- `c.PostForm("key")` / `c.DefaultPostForm("key", "default")` — يقرأ من جسم الطلب بتنسيق `application/x-www-form-urlencoded` أو `multipart/form-data`.

هذا شائع في واجهات REST APIs حيث يُحدد المسار المورد (عبر معاملات الاستعلام مثل `id`) بينما يحمل الجسم الحمولة (مثل `name` و`message`).

```go
package main

import (
  "fmt"
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.POST("/post", func(c *gin.Context) {
    id := c.Query("id")
    page := c.DefaultQuery("page", "0")
    name := c.PostForm("name")
    message := c.PostForm("message")

    fmt.Printf("id: %s; page: %s; name: %s; message: %s\n", id, page, name, message)
    c.String(http.StatusOK, "id: %s; page: %s; name: %s; message: %s", id, page, name, message)
  })

  router.Run(":8080")
}
```

## اختبره

```sh
# Query params in URL, form data in body
curl -X POST "http://localhost:8080/post?id=1234&page=1" \
  -d "name=manu&message=this_is_great"
# Output: id: 1234; page: 1; name: manu; message: this_is_great

# Missing page -- falls back to default value "0"
curl -X POST "http://localhost:8080/post?id=1234" \
  -d "name=manu&message=hello"
# Output: id: 1234; page: 0; name: manu; message: hello
```

:::note
`c.Query` يقرأ فقط من سلسلة استعلام URL، و`c.PostForm` يقرأ فقط من جسم الطلب. لا يتقاطعان أبداً. إذا أردت أن يتحقق Gin من كلا المصدرين تلقائياً، استخدم `c.ShouldBind` مع هيكل بدلاً من ذلك.
:::

## انظر أيضاً

- [معاملات سلسلة الاستعلام](/ar/docs/routing/querystring-param/)
- [Map كمعاملات سلسلة استعلام أو نموذج إرسال](/ar/docs/routing/map-as-querystring-or-postform/)
- [نموذج Multipart/Urlencoded](/ar/docs/routing/multipart-urlencoded-form/)
