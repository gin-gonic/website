---
title: "میان‌افزار سفارشی"
sidebar:
  order: 3
---

میان‌افزار Gin تابعی است که `gin.HandlerFunc` برمی‌گرداند. میان‌افزار قبل و/یا بعد از handler اصلی اجرا می‌شود که آن را برای لاگ‌گذاری، احراز هویت، مدیریت خطا و سایر مسائل مشترک مفید می‌سازد.

### جریان اجرای میان‌افزار

یک تابع میان‌افزار دو مرحله دارد که با فراخوانی `c.Next()` تقسیم می‌شوند:

- **قبل از `c.Next()`** -- کد اینجا قبل از رسیدن درخواست به handler اصلی اجرا می‌شود. از این مرحله برای وظایف راه‌اندازی مانند ثبت زمان شروع، اعتبارسنجی توکن‌ها یا تنظیم مقادیر context با `c.Set()` استفاده کنید.
- **`c.Next()`** -- این handler بعدی در زنجیره را فراخوانی می‌کند (که ممکن است میان‌افزار دیگری یا handler نهایی مسیر باشد). اجرا اینجا متوقف می‌شود تا تمام handlerهای بعدی کامل شوند.
- **بعد از `c.Next()`** -- کد اینجا پس از اتمام handler اصلی اجرا می‌شود. از این مرحله برای پاکسازی، لاگ‌گذاری وضعیت پاسخ یا اندازه‌گیری تأخیر استفاده کنید.

اگر می‌خواهید زنجیره را کاملاً متوقف کنید (مثلاً وقتی احراز هویت ناموفق است)، به جای `c.Next()` از `c.Abort()` استفاده کنید. این از اجرای handlerهای باقی‌مانده جلوگیری می‌کند. می‌توانید آن را با پاسخ ترکیب کنید، مثلاً `c.AbortWithStatusJSON(401, gin.H{"error": "unauthorized"})`.

```go
package main

import (
  "log"
  "time"

  "github.com/gin-gonic/gin"
)

func Logger() gin.HandlerFunc {
  return func(c *gin.Context) {
    t := time.Now()

    // Set example variable
    c.Set("example", "12345")

    // before request

    c.Next()

    // after request
    latency := time.Since(t)
    log.Print(latency)

    // access the status we are sending
    status := c.Writer.Status()
    log.Println(status)
  }
}

func main() {
  r := gin.New()
  r.Use(Logger())

  r.GET("/test", func(c *gin.Context) {
    example := c.MustGet("example").(string)

    // it would print: "12345"
    log.Println(example)
  })

  // Listen and serve on 0.0.0.0:8080
  r.Run(":8080")
}
```

### امتحان کنید

```bash
curl http://localhost:8080/test
```

لاگ‌های سرور تأخیر درخواست و کد وضعیت HTTP را برای هر درخواستی که از میان‌افزار `Logger` عبور می‌کند نشان خواهند داد.

## همچنین ببینید

- [میان‌افزار مدیریت خطا](/en/docs/middleware/error-handling-middleware/)
- [استفاده از میان‌افزار](/en/docs/middleware/using-middleware/)

