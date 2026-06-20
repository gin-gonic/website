---
title: "Multipart/Urlencoded 表單"
sidebar:
  order: 4
---

使用 `c.PostForm()` 和 `c.DefaultPostForm()` 來讀取表單提交的值。這些方法同時支援 `application/x-www-form-urlencoded` 和 `multipart/form-data` 內容類型——這是瀏覽器提交表單資料的兩種標準方式。

- `c.PostForm("field")` 回傳欄位值，如果欄位不存在則回傳空字串。
- `c.DefaultPostForm("field", "fallback")` 回傳欄位值，如果欄位不存在則回傳指定的預設值。

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

## 測試

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

## 另請參閱

- [檔案上傳](/zh-tw/docs/routing/upload-file/)
- [查詢與 POST 表單](/zh-tw/docs/routing/query-and-post-form/)
