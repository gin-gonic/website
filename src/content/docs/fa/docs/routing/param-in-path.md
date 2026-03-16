---
title: "پارامترها در مسیر"
sidebar:
  order: 2
---

Gin از دو نوع پارامتر مسیر پشتیبانی می‌کند که به شما امکان می‌دهد مقادیر را مستقیماً از URL دریافت کنید:

- **`:name`** -- یک بخش مسیر را مطابقت می‌دهد. به‌عنوان مثال، `/user/:name` با `/user/john` مطابقت دارد اما با `/user/` یا `/user` مطابقت **ندارد**.
- **`*action`** -- همه چیز پس از پیشوند، شامل اسلش‌ها را مطابقت می‌دهد. به‌عنوان مثال، `/user/:name/*action` با `/user/john/send` و `/user/john/` مطابقت دارد. مقدار گرفته‌شده شامل `/` ابتدایی است.

از `c.Param("name")` برای دریافت مقدار پارامتر مسیر در handler خود استفاده کنید.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  // This handler will match /user/john but will not match /user/ or /user
  router.GET("/user/:name", func(c *gin.Context) {
    name := c.Param("name")
    c.String(http.StatusOK, "Hello %s", name)
  })

  // However, this one will match /user/john/ and also /user/john/send
  // If no other routers match /user/john, it will redirect to /user/john/
  router.GET("/user/:name/*action", func(c *gin.Context) {
    name := c.Param("name")
    action := c.Param("action")
    message := name + " is " + action
    c.String(http.StatusOK, message)
  })

  router.Run(":8080")
}
```

## تست

```sh
# Single parameter -- matches :name
curl http://localhost:8080/user/john
# Output: Hello john

# Wildcard parameter -- matches :name and *action
curl http://localhost:8080/user/john/send
# Output: john is /send

# Trailing slash is captured by the wildcard
curl http://localhost:8080/user/john/
# Output: john is /
```

:::note
مقدار wildcard `*action` همیشه شامل `/` ابتدایی است. در مثال بالا، `c.Param("action")` مقدار `/send` را برمی‌گرداند، نه `send`.
:::

:::caution
نمی‌توانید هم `/user/:name` و هم `/user/:name/*action` را تعریف کنید اگر در همان عمق مسیر تداخل داشته باشند. Gin هنگام شروع اگر مسیرهای مبهم تشخیص دهد، panic خواهد کرد.
:::

## همچنین ببینید

- [پارامترهای رشته پرس‌وجو](/fa/docs/routing/querystring-param/)
- [فرم پرس‌وجو و ارسال](/fa/docs/routing/query-and-post-form/)
