---
title: "نموذج Multipart/Urlencoded"
sidebar:
  order: 4
---

استخدم `c.PostForm()` و`c.DefaultPostForm()` لقراءة القيم من إرسال النماذج. تعمل هذه الطرق مع كل من نوعي المحتوى `application/x-www-form-urlencoded` و`multipart/form-data` -- وهما الطريقتان القياسيتان التي تُرسل بهما المتصفحات بيانات النماذج.

- `c.PostForm("field")` تُرجع القيمة أو سلسلة فارغة إذا كان الحقل مفقوداً.
- `c.DefaultPostForm("field", "fallback")` تُرجع القيمة أو القيمة الافتراضية المحددة إذا كان الحقل مفقوداً.

```go
func main() {
  router := gin.Default()

  router.POST("/form_post", func(c *gin.Context) {
    message := c.PostForm("message")
    nick := c.DefaultPostForm("nick", "anonymous")

    c.JSON(200, gin.H{
      "status":  "posted",
      "message": message,
      "nick":    nick,
    })
  })
  router.Run(":8080")
}
```

### جرّبها

```sh
# URL-encoded form
curl -X POST http://localhost:8080/form_post \
  -d "message=hello&nick=world"

# Multipart form
curl -X POST http://localhost:8080/form_post \
  -F "message=hello" -F "nick=world"
```

## انظر أيضاً

- [رفع الملفات](/ar/docs/routing/upload-file/)
- [الاستعلام ونموذج الإرسال](/ar/docs/routing/query-and-post-form/)
