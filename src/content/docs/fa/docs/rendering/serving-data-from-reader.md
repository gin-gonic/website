---
title: "ارائه داده از reader"
sidebar:
  order: 8
---

`DataFromReader` به شما اجازه می‌دهد داده‌ها را از هر `io.Reader` مستقیماً به پاسخ HTTP بدون بافر کردن کل محتوا در حافظه جریان‌سازی کنید. این برای ساخت نقاط پایانی پروکسی یا ارائه فایل‌های بزرگ از منابع راه دور به صورت کارآمد ضروری است.

**موارد استفاده رایج:**

- **پروکسی کردن منابع راه دور** -- دریافت فایل از یک سرویس خارجی (مانند API ذخیره‌سازی ابری یا CDN) و ارسال آن به کلاینت. داده‌ها بدون بارگذاری کامل در حافظه از سرور شما عبور می‌کنند.
- **ارائه محتوای تولید شده** -- جریان‌سازی داده‌های تولید شده به صورت پویا (مانند صادرات CSV یا فایل‌های گزارش) همان‌طور که تولید می‌شوند.
- **دانلود فایل‌های بزرگ** -- ارائه فایل‌هایی که برای نگهداری در حافظه بسیار بزرگ هستند، با خواندن آن‌ها به صورت تکه‌ای از دیسک یا از یک منبع راه دور.

امضای متد `c.DataFromReader(code, contentLength, contentType, reader, extraHeaders)` است. شما کد وضعیت HTTP، طول محتوا (تا کلاینت حجم کل را بداند)، نوع MIME، `io.Reader` برای جریان‌سازی و یک map اختیاری از هدرهای پاسخ اضافی (مانند `Content-Disposition` برای دانلود فایل) ارائه می‌دهید.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()
  router.GET("/someDataFromReader", func(c *gin.Context) {
    response, err := http.Get("https://raw.githubusercontent.com/gin-gonic/logo/master/color.png")
    if err != nil || response.StatusCode != http.StatusOK {
      c.Status(http.StatusServiceUnavailable)
      return
    }

    reader := response.Body
    contentLength := response.ContentLength
    contentType := response.Header.Get("Content-Type")

    extraHeaders := map[string]string{
      "Content-Disposition": `attachment; filename="gopher.png"`,
    }

    c.DataFromReader(http.StatusOK, contentLength, contentType, reader, extraHeaders)
  })
  router.Run(":8080")
}
```

در این مثال، Gin یک تصویر را از GitHub دریافت کرده و مستقیماً به عنوان یک پیوست قابل دانلود به کلاینت جریان‌سازی می‌کند. بایت‌های تصویر از بدنه پاسخ HTTP بالادستی بدون انباشته شدن در بافر به پاسخ کلاینت جریان می‌یابند. توجه داشته باشید که `response.Body` به طور خودکار توسط سرور HTTP پس از بازگشت handler بسته می‌شود، زیرا `DataFromReader` آن را در طول نوشتن پاسخ تا انتها می‌خواند.
