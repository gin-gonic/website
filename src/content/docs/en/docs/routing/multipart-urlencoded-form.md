---
title: "Multipart/Urlencoded form"
sidebar:
  order: 4
---

Use `c.PostForm()` and `c.DefaultPostForm()` to read values from form submissions. These methods work with both `application/x-www-form-urlencoded` and `multipart/form-data` content types -- the two standard ways browsers submit form data.

- `c.PostForm("field")` returns the value or an empty string if the field is missing.
- `c.DefaultPostForm("field", "fallback")` returns the value or the specified default if the field is missing.

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

## Test it

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

## See also

- [Upload files](/en/docs/routing/upload-file/)
- [Query and post form](/en/docs/routing/query-and-post-form/)

