---
title: "رفتار سفارشی بازیابی"
sidebar:
  order: 4
---

میان‌افزار داخلی `gin.Recovery()` در Gin هر panic رخ‌داده هنگام پردازش یک درخواست را می‌گیرد، یک پاسخ `500` می‌نویسد و سرور را در حال اجرا نگه می‌دارد. وقتی نیاز دارید آنچه را که هنگام بازیابی اتفاق می‌افتد کنترل کنید -- برای مثال گزارش panic به کاربر، ذخیره آن در پایگاه داده، یا ارسال آن به یک سرویس ردیابی خطا -- به جای آن از `gin.CustomRecovery()` استفاده کنید.

تابع `gin.CustomRecovery()` یک handler با امضای `func(c *gin.Context, recovered any)` می‌گیرد. مقدار `recovered` همان چیزی است که به `panic()` پاس داده شده است. درون handler تصمیم می‌گیرید چگونه پاسخ دهید، سپس `c.AbortWithStatus()` (یا متد abort دیگری) را فراخوانی می‌کنید تا handlerهای باقی‌مانده نادیده گرفته شوند.

```go
package main

import (
  "fmt"
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  // Creates a router without any middleware by default
  r := gin.New()

  // Global middleware
  // Logger middleware will write the logs to gin.DefaultWriter even if you set with GIN_MODE=release.
  // By default gin.DefaultWriter = os.Stdout
  r.Use(gin.Logger())

  // Recovery middleware recovers from any panics and writes a 500 if there was one.
  r.Use(gin.CustomRecovery(func(c *gin.Context, recovered any) {
    if err, ok := recovered.(string); ok {
      c.String(http.StatusInternalServerError, fmt.Sprintf("error: %s", err))
    }
    c.AbortWithStatus(http.StatusInternalServerError)
  }))

  r.GET("/panic", func(c *gin.Context) {
    // panic with a string -- the custom middleware could save this to a database or report it to the user
    panic("foo")
  })

  r.GET("/", func(c *gin.Context) {
    c.String(http.StatusOK, "ohai")
  })

  // Listen and serve on 0.0.0.0:8080
  r.Run(":8080")
}
```

## امتحان کنید

```bash
# Triggers the panic; the custom recovery handler returns the message
curl http://localhost:8080/panic
# => error: foo

# A normal request still works
curl http://localhost:8080/
# => ohai
```

## همچنین ببینید

- [میان‌افزار سفارشی](/fa/docs/middleware/custom-middleware/)
- [Gin خالی بدون میان‌افزار به‌صورت پیش‌فرض](/fa/docs/middleware/without-middleware/)
- [میان‌افزار مدیریت خطا](/fa/docs/middleware/error-handling-middleware/)
