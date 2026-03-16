---
title: "فرم Multipart/Urlencoded"
sidebar:
  order: 4
---

از `c.PostForm()` و `c.DefaultPostForm()` برای خواندن مقادیر از ارسال فرم استفاده کنید. این متدها با هر دو نوع محتوای `application/x-www-form-urlencoded` و `multipart/form-data` کار می‌کنند -- دو روش استاندارد مرورگرها برای ارسال داده‌های فرم.

- `c.PostForm("field")` مقدار را برمی‌گرداند یا در صورت عدم وجود فیلد، رشته خالی برمی‌گرداند.
- `c.DefaultPostForm("field", "fallback")` مقدار را برمی‌گرداند یا در صورت عدم وجود فیلد، مقدار پیش‌فرض مشخص شده را برمی‌گرداند.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

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

## تست

```sh
# URL-encoded form
curl -X POST http://localhost:8080/form_post \
  -d "message=hello&nick=world"
# Output: {"message":"hello","nick":"world","status":"posted"}

# Multipart form
curl -X POST http://localhost:8080/form_post \
  -F "message=hello" -F "nick=world"
# Output: {"message":"hello","nick":"world","status":"posted"}

# Missing nick -- falls back to default "anonymous"
curl -X POST http://localhost:8080/form_post \
  -d "message=hello"
# Output: {"message":"hello","nick":"anonymous","status":"posted"}
```

## همچنین ببینید

- [آپلود فایل‌ها](/fa/docs/routing/upload-file/)
- [فرم پرس‌وجو و ارسال](/fa/docs/routing/query-and-post-form/)
