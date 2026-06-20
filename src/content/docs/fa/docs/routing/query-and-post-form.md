---
title: "فرم پرس‌وجو و ارسال"
sidebar:
  order: 5
---

هنگام پردازش یک درخواست `POST`، اغلب نیاز دارید مقادیر را هم از رشته پرس‌وجوی URL و هم از بدنه درخواست بخوانید. Gin این دو منبع را جدا نگه می‌دارد تا بتوانید به هر کدام به‌صورت مستقل دسترسی داشته باشید:

- `c.Query("key")` / `c.DefaultQuery("key", "default")` -- از رشته پرس‌وجوی URL می‌خواند.
- `c.PostForm("key")` / `c.DefaultPostForm("key", "default")` -- از بدنه درخواست `application/x-www-form-urlencoded` یا `multipart/form-data` می‌خواند.

این در APIهای REST رایج است که مسیر منبع را شناسایی می‌کند (از طریق پارامترهای query مانند `id`) در حالی که بدنه داده‌ها را حمل می‌کند (مانند `name` و `message`).

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

## تست

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
`c.Query` فقط از رشته پرس‌وجوی URL می‌خواند و `c.PostForm` فقط از بدنه درخواست. آن‌ها هرگز با هم تداخل نمی‌کنند. اگر می‌خواهید Gin هر دو منبع را به‌صورت خودکار بررسی کند، به‌جای آن از `c.ShouldBind` با یک struct استفاده کنید.
:::

## همچنین ببینید

- [پارامترهای رشته پرس‌وجو](/fa/docs/routing/querystring-param/)
- [Map به عنوان پارامترهای رشته پرس‌وجو یا فرم ارسال](/fa/docs/routing/map-as-querystring-or-postform/)
- [فرم Multipart/Urlencoded](/fa/docs/routing/multipart-urlencoded-form/)
