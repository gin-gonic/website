---
title: "نحوه نوشتن فایل لاگ"
sidebar:
  order: 1
---

نوشتن لاگ‌ها در فایل برای برنامه‌های تولیدی ضروری است که نیاز به نگهداری تاریخچه درخواست‌ها برای اشکال‌زدایی، حسابرسی یا نظارت دارید. به طور پیش‌فرض، Gin تمام خروجی لاگ را به `os.Stdout` می‌نویسد. می‌توانید با تنظیم `gin.DefaultWriter` قبل از ایجاد روتر این را تغییر دهید.

```go
package main

import (
  "io"
  "os"

  "github.com/gin-gonic/gin"
)

func main() {
    // Disable Console Color, you don't need console color when writing the logs to file.
    gin.DisableConsoleColor()

    // Logging to a file.
    f, _ := os.Create("gin.log")
    gin.DefaultWriter = io.MultiWriter(f)

    // Use the following code if you need to write the logs to file and console at the same time.
    // gin.DefaultWriter = io.MultiWriter(f, os.Stdout)

    router := gin.Default()
    router.GET("/ping", func(c *gin.Context) {
        c.String(200, "pong")
    })

    router.Run(":8080")
}
```

### نوشتن همزمان در فایل و کنسول

تابع `io.MultiWriter` از کتابخانه استاندارد Go چندین مقدار `io.Writer` می‌پذیرد و نوشتن را در تمام آن‌ها تکثیر می‌کند. این در هنگام توسعه مفید است وقتی می‌خواهید لاگ‌ها را در ترمینال ببینید و در عین حال آن‌ها را روی دیسک نیز ذخیره کنید:

```go
f, _ := os.Create("gin.log")
gin.DefaultWriter = io.MultiWriter(f, os.Stdout)
```

با این تنظیم، هر ورودی لاگ به طور همزمان هم در `gin.log` و هم در کنسول نوشته می‌شود.

### چرخش لاگ در تولید

مثال بالا از `os.Create` استفاده می‌کند که فایل لاگ را هر بار که برنامه شروع می‌شود خالی می‌کند. در تولید، معمولاً می‌خواهید به لاگ‌های موجود اضافه کنید و فایل‌ها را بر اساس حجم یا زمان بچرخانید. استفاده از یک کتابخانه چرخش لاگ مانند [lumberjack](https://github.com/natefinch/lumberjack) را در نظر بگیرید:

```go
import "gopkg.in/natefinch/lumberjack.v2"

func main() {
    gin.DisableConsoleColor()

    gin.DefaultWriter = &lumberjack.Logger{
        Filename:   "gin.log",
        MaxSize:    100, // megabytes
        MaxBackups: 3,
        MaxAge:     28, // days
    }

    router := gin.Default()
    router.GET("/ping", func(c *gin.Context) {
        c.String(200, "pong")
    })

    router.Run(":8080")
}
```

### همچنین ببینید

- [فرمت لاگ سفارشی](../custom-log-format/) -- تعریف فرمت خط لاگ خود.
- [کنترل رنگ‌آمیزی خروجی لاگ](../controlling-log-output-coloring/) -- غیرفعال یا اجبار خروجی رنگی.
- [رد شدن از لاگ‌گذاری](../skip-logging/) -- حذف مسیرهای خاص از لاگ‌گذاری.
