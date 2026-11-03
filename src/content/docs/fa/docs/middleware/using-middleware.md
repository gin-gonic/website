---
title: "استفاده از میان‌افزار"
sidebar:
  order: 2
---

میان‌افزار در Gin توابعی هستند که قبل (و اختیاراً بعد) از handler مسیر شما اجرا می‌شوند. آن‌ها برای مسائل مشترک مانند لاگ‌گذاری، احراز هویت، بازیابی خطا و تغییر درخواست استفاده می‌شوند.

Gin از سه سطح اتصال میان‌افزار پشتیبانی می‌کند:

- **میان‌افزار سراسری** -- روی هر مسیر در روتر اعمال می‌شود. با `router.Use()` ثبت می‌شود. مناسب برای مسائلی مانند لاگ‌گذاری و بازیابی panic که به صورت جهانی اعمال می‌شوند.
- **میان‌افزار گروهی** -- روی تمام مسیرهای یک گروه مسیر اعمال می‌شود. با `group.Use()` ثبت می‌شود. مفید برای اعمال احراز هویت یا مجوزدهی به زیرمجموعه‌ای از مسیرها (مثلاً تمام مسیرهای `/admin/*`).
- **میان‌افزار هر مسیر** -- فقط روی یک مسیر واحد اعمال می‌شود. به عنوان آرگومان‌های اضافی به `router.GET()`، `router.POST()` و غیره ارسال می‌شود. مفید برای منطق خاص مسیر مانند محدودیت نرخ سفارشی یا اعتبارسنجی ورودی.

**ترتیب اجرا:** توابع میان‌افزار به ترتیبی که ثبت شده‌اند اجرا می‌شوند. فراخوانی `c.Next()`، handlerهای باقی‌مانده را اجرا می‌کند و پس از بازگشت آن، اجرای میان‌افزار فعلی ادامه می‌یابد. به این ترتیب می‌توانید قبل و بعد از handlerهای بعدی کد اجرا کنید؛ وقتی میان‌افزارها به این شکل handlerهای بعدی را در بر می‌گیرند، پردازش پس از آن‌ها به ترتیب معکوس (LIFO) اجرا می‌شود.

اگر میان‌افزاری بدون فراخوانی `c.Next()` بازگردد، میان‌افزارهای بعدی و handler همچنان اجرا می‌شوند، مگر اینکه context متوقف شده باشد. برای رد کردن handlerهایی که هنوز اجرا نشده‌اند، `c.Abort()` یا یکی از متدهای `AbortWithStatus*` را فراخوانی کنید. توقف context تابع میان‌افزار فعلی را متوقف نمی‌کند؛ بنابراین اگر می‌خواهید اجرای بقیهٔ کد آن تابع نیز متوقف شود، از `return` استفاده کنید.

```go
package main

import (
  "github.com/gin-gonic/gin"
)

func main() {
  // Creates a router without any middleware by default
  router := gin.New()

  // Global middleware
  // Logger middleware will write the logs to gin.DefaultWriter even if you set with GIN_MODE=release.
  // By default gin.DefaultWriter = os.Stdout
  router.Use(gin.Logger())

  // Recovery middleware recovers from any panics and writes a 500 if there was one.
  router.Use(gin.Recovery())

  // Per route middleware, you can add as many as you desire.
  router.GET("/benchmark", MyBenchLogger(), benchEndpoint)

  // Authorization group
  // authorized := router.Group("/", AuthRequired())
  // exactly the same as:
  authorized := router.Group("/")
  // per group middleware! in this case we use the custom created
  // AuthRequired() middleware just in the "authorized" group.
  authorized.Use(AuthRequired())
  {
    authorized.POST("/login", loginEndpoint)
    authorized.POST("/submit", submitEndpoint)
    authorized.POST("/read", readEndpoint)

    // nested group
    testing := authorized.Group("testing")
    testing.GET("/analytics", analyticsEndpoint)
  }

  // Listen and serve on 0.0.0.0:8080
  router.Run(":8080")
}
```

:::note
`gin.Default()` یک تابع کمکی است که یک روتر با میان‌افزارهای `Logger` و `Recovery` از قبل متصل شده ایجاد می‌کند. اگر یک روتر خام بدون میان‌افزار می‌خواهید، از `gin.New()` مانند بالا استفاده کنید و فقط میان‌افزارهای مورد نیاز خود را اضافه کنید.
:::
