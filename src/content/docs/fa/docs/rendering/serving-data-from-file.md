---
title: "ارائه داده از فایل"
sidebar:
  order: 7
---

Gin چندین متد برای ارائه فایل‌ها به کلاینت‌ها فراهم می‌کند. هر متد برای یک مورد استفاده متفاوت مناسب است:

- **`c.File(path)`** -- یک فایل را از سیستم فایل محلی ارائه می‌دهد. نوع محتوا به طور خودکار تشخیص داده می‌شود. از این زمانی استفاده کنید که مسیر دقیق فایل را در زمان کامپایل می‌دانید یا قبلاً آن را اعتبارسنجی کرده‌اید.
- **`c.FileFromFS(path, fs)`** -- یک فایل را از رابط `http.FileSystem` ارائه می‌دهد. مناسب برای ارائه فایل‌ها از سیستم‌های فایل جاگذاری شده (`embed.FS`)، پشتیبان‌های ذخیره‌سازی سفارشی یا زمانی که می‌خواهید دسترسی به یک درخت دایرکتوری خاص را محدود کنید.
- **`c.FileAttachment(path, filename)`** -- یک فایل را به عنوان دانلود با تنظیم هدر `Content-Disposition: attachment` ارائه می‌دهد. مرورگر از کاربر می‌خواهد فایل را با نام فایلی که ارائه می‌دهید ذخیره کند، صرف‌نظر از نام فایل اصلی روی دیسک.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  // Serve a file inline (displayed in browser)
  router.GET("/local/file", func(c *gin.Context) {
    c.File("local/file.go")
  })

  // Serve a file from an http.FileSystem
  var fs http.FileSystem = http.Dir("/var/www/assets")
  router.GET("/fs/file", func(c *gin.Context) {
    c.FileFromFS("fs/file.go", fs)
  })

  // Serve a file as a downloadable attachment with a custom filename
  router.GET("/download", func(c *gin.Context) {
    c.FileAttachment("local/report-2024-q1.xlsx", "quarterly-report.xlsx")
  })

  router.Run(":8080")
}
```

می‌توانید نقطه پایانی دانلود را با curl تست کنید:

```sh
# The -v flag shows the Content-Disposition header
curl -v http://localhost:8080/download --output report.xlsx

# Serve a file inline
curl http://localhost:8080/local/file
```

برای جریان‌سازی داده‌ها از `io.Reader` (مانند URL راه دور یا محتوای تولید شده به صورت پویا)، به جای آن از `c.DataFromReader()` استفاده کنید. برای جزئیات [ارائه داده از reader](/en/docs/rendering/serving-data-from-reader/) را ببینید.

:::caution[امنیت: پیمایش مسیر]
هرگز ورودی کاربر را مستقیماً به `c.File()` یا `c.FileAttachment()` ارسال نکنید. یک مهاجم می‌تواند مسیری مانند `../../etc/passwd` ارائه دهد تا فایل‌های دلخواه روی سرور شما را بخواند. همیشه مسیرهای فایل را اعتبارسنجی و پاکسازی کنید، یا از `c.FileFromFS()` با `http.FileSystem` محدود شده استفاده کنید که دسترسی را به یک دایرکتوری خاص محدود می‌کند.

```go
// DANGEROUS -- never do this
router.GET("/files/:name", func(c *gin.Context) {
  c.File(c.Param("name")) // attacker controls the path
})

// SAFE -- restrict to a specific directory
var safeFS http.FileSystem = http.Dir("/var/www/public")
router.GET("/files/:name", func(c *gin.Context) {
  c.FileFromFS(c.Param("name"), safeFS)
})
```
:::
