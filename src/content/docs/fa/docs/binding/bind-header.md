---
title: "اتصال هدر"
sidebar:
  order: 9
---

`ShouldBindHeader` هدرهای درخواست HTTP را مستقیماً با استفاده از تگ‌های `header` در struct به آن متصل می‌کند. این برای استخراج فراداده‌هایی مانند محدودیت نرخ API، توکن‌های احراز هویت، یا هدرهای دامنه سفارشی از درخواست‌های ورودی مفید است.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

type testHeader struct {
  Rate   int    `header:"Rate"`
  Domain string `header:"Domain"`
}

func main() {
  r := gin.Default()

  r.GET("/", func(c *gin.Context) {
    h := testHeader{}

    if err := c.ShouldBindHeader(&h); err != nil {
      c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      return
    }

    c.JSON(http.StatusOK, gin.H{"Rate": h.Rate, "Domain": h.Domain})
  })

  r.Run(":8080")
}
```

## تست

```sh
# Pass custom headers
curl -H "Rate:300" -H "Domain:music" http://localhost:8080/
# Output: {"Domain":"music","Rate":300}

# Missing headers -- zero values are used
curl http://localhost:8080/
# Output: {"Domain":"","Rate":0}
```

:::note
نام هدرها طبق مشخصات HTTP حساس به بزرگی و کوچکی حروف نیستند. مقدار تگ `header` در struct بدون حساسیت به بزرگی و کوچکی حروف تطبیق داده می‌شود، بنابراین `header:"Rate"` با هدرهای ارسال‌شده به‌صورت `Rate`، `rate` یا `RATE` مطابقت خواهد داشت.
:::

:::tip
می‌توانید تگ‌های `header` را با `binding:"required"` ترکیب کنید تا درخواست‌هایی که هدرهای ضروری را ندارند رد شوند:

```go
type authHeader struct {
  Token string `header:"Authorization" binding:"required"`
}
```

:::

## همچنین ببینید

- [اتصال و اعتبارسنجی](/fa/docs/binding/binding-and-validation/)
- [اتصال رشته پرس‌وجو یا داده ارسالی](/fa/docs/binding/bind-query-or-post/)
