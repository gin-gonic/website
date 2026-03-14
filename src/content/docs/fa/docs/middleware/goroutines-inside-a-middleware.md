---
title: "گوروتین‌ها در میان‌افزار"
sidebar:
  order: 6
---

هنگام شروع گوروتین‌های جدید در یک میان‌افزار یا handler، **نباید** از context اصلی در داخل آن استفاده کنید، باید از یک کپی فقط خواندنی استفاده کنید.

### چرا `c.Copy()` ضروری است

Gin از **sync.Pool** برای استفاده مجدد از اشیاء `gin.Context` در درخواست‌ها به منظور عملکرد بهتر استفاده می‌کند. وقتی یک handler برمی‌گردد، `gin.Context` به pool بازگردانده می‌شود و ممکن است به یک درخواست کاملاً متفاوت اختصاص داده شود. اگر یک گوروتین هنوز به context اصلی ارجاع داشته باشد، فیلدهایی را می‌خواند یا می‌نویسد که اکنون به درخواست دیگری تعلق دارند. این منجر به **شرایط رقابتی**، **خرابی داده‌ها** یا **panic** می‌شود.

فراخوانی `c.Copy()` یک عکس فوری از context ایجاد می‌کند که پس از بازگشت handler استفاده از آن امن است. کپی شامل درخواست، URL، کلیدها و سایر داده‌های فقط خواندنی است، اما از چرخه حیات pool جدا شده است.

```go
package main

import (
  "log"
  "time"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.GET("/long_async", func(c *gin.Context) {
    // create copy to be used inside the goroutine
    cCp := c.Copy()
    go func() {
      // simulate a long task with time.Sleep(). 5 seconds
      time.Sleep(5 * time.Second)

      // note that you are using the copied context "cCp", IMPORTANT
      log.Println("Done! in path " + cCp.Request.URL.Path)
    }()
  })

  router.GET("/long_sync", func(c *gin.Context) {
    // simulate a long task with time.Sleep(). 5 seconds
    time.Sleep(5 * time.Second)

    // since we are NOT using a goroutine, we do not have to copy the context
    log.Println("Done! in path " + c.Request.URL.Path)
  })

  // Listen and serve on 0.0.0.0:8080
  router.Run(":8080")
}
```
