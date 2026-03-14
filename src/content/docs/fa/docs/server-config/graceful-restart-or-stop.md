---
title: "راه‌اندازی مجدد یا توقف آرام"
sidebar:
  order: 5
---

وقتی یک فرآیند سرور سیگنال خاتمه دریافت می‌کند (مثلاً در حین استقرار یا رویداد مقیاس‌بندی)، یک خاموشی فوری تمام درخواست‌های در حال انجام را قطع می‌کند و کلاینت‌ها را با اتصالات شکسته و عملیات احتمالاً خراب شده مواجه می‌کند. یک **خاموشی آرام** این مشکل را حل می‌کند با:

- **تکمیل درخواست‌های در حال انجام** -- به درخواست‌هایی که در حال پردازش هستند زمان داده می‌شود تا تمام شوند، بنابراین کلاینت‌ها پاسخ‌های مناسب به جای بازنشانی اتصال دریافت می‌کنند.
- **تخلیه اتصالات** -- سرور پذیرش اتصالات جدید را متوقف می‌کند در حالی که اتصالات موجود اجازه تکمیل دارند.
- **پاکسازی منابع** -- اتصالات باز پایگاه داده، handle فایل‌ها و workerهای پس‌زمینه به درستی بسته می‌شوند و از خرابی داده یا نشت منابع جلوگیری می‌شود.
- **فعال‌سازی استقرار بدون قطعی** -- در ترکیب با یک متعادل‌کننده بار، خاموشی آرام به شما اجازه می‌دهد نسخه‌های جدید را بدون خطای قابل مشاهده برای کاربر منتشر کنید.

چندین روش برای دستیابی به این در Go وجود دارد.

می‌توانیم از [fvbock/endless](https://github.com/fvbock/endless) برای جایگزینی `ListenAndServe` پیش‌فرض استفاده کنیم. برای جزئیات بیشتر به مسئله [#296](https://github.com/gin-gonic/gin/issues/296) مراجعه کنید.

```go
router := gin.Default()
router.GET("/", handler)
// [...]
endless.ListenAndServe(":4242", router)
```

جایگزین‌هایی برای endless:

* [manners](https://github.com/braintree/manners): یک سرور HTTP مودب Go که به صورت آرام خاموش می‌شود.
* [graceful](https://github.com/tylerb/graceful): Graceful یک پکیج Go است که خاموشی آرام یک سرور http.Handler را فعال می‌کند.
* [grace](https://github.com/facebookgo/grace): راه‌اندازی مجدد آرام و استقرار بدون قطعی برای سرورهای Go.

اگر از Go نسخه 1.8 و بالاتر استفاده می‌کنید، ممکن است نیازی به استفاده از این کتابخانه نداشته باشید! استفاده از متد [Shutdown()](https://golang.org/pkg/net/http/#Server.Shutdown) داخلی `http.Server` را برای خاموشی‌های آرام در نظر بگیرید. مثال کامل [graceful-shutdown](https://github.com/gin-gonic/examples/tree/master/graceful-shutdown) با gin را ببینید.

```go
//go:build go1.8
// +build go1.8

package main

import (
  "context"
  "log"
  "net/http"
  "os"
  "os/signal"
  "syscall"
  "time"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()
  router.GET("/", func(c *gin.Context) {
    time.Sleep(5 * time.Second)
    c.String(http.StatusOK, "Welcome Gin Server")
  })

  srv := &http.Server{
    Addr:    ":8080",
    Handler: router.Handler(),
  }

  go func() {
    // service connections
    if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
      log.Fatalf("listen: %s\n", err)
    }
  }()

  // Wait for interrupt signal to gracefully shutdown the server with
  // a timeout of 5 seconds.
  quit := make(chan os.Signal, 1)
  // kill (no params) by default sends syscall.SIGTERM
  // kill -2 is syscall.SIGINT
  // kill -9 is syscall.SIGKILL but can't be caught, so don't need add it
  signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
  <-quit
  log.Println("Shutdown Server ...")

  ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
  defer cancel()
  if err := srv.Shutdown(ctx); err != nil {
    log.Println("Server Shutdown:", err)
  }
  log.Println("Server exiting")
}
```
