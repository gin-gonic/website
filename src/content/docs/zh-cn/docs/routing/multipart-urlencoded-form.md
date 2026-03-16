---
title: "Multipart/Urlencoded 表单"
sidebar:
  order: 4
---

使用 `c.PostForm()` 和 `c.DefaultPostForm()` 来读取表单提交的值。这些方法适用于 `application/x-www-form-urlencoded` 和 `multipart/form-data` 内容类型——这是浏览器提交表单数据的两种标准方式。

- `c.PostForm("field")` 返回值，如果字段不存在则返回空字符串。
- `c.DefaultPostForm("field", "fallback")` 返回值，如果字段不存在则返回指定的默认值。

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

## 测试

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

## 另请参阅

- [文件上传](/zh-cn/docs/routing/upload-file/)
- [查询字符串和表单](/zh-cn/docs/routing/query-and-post-form/)
