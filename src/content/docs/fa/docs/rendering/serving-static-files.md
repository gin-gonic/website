---
title: "ارائه فایل‌های استاتیک"
sidebar:
  order: 6
---

Gin سه متد برای ارائه محتوای استاتیک فراهم می‌کند:

- **`router.Static(relativePath, root)`** -- یک دایرکتوری کامل را ارائه می‌دهد. درخواست‌ها به `relativePath` به فایل‌های زیر `root` نگاشت می‌شوند. به عنوان مثال، `router.Static("/assets", "./assets")` فایل `./assets/style.css` را در `/assets/style.css` ارائه می‌دهد.
- **`router.StaticFS(relativePath, fs)`** -- مانند `Static`، اما یک رابط `http.FileSystem` می‌پذیرد که کنترل بیشتری بر نحوه حل فایل‌ها به شما می‌دهد. از این زمانی استفاده کنید که نیاز به ارائه فایل‌ها از سیستم فایل جاگذاری شده دارید یا می‌خواهید رفتار فهرست دایرکتوری را سفارشی کنید.
- **`router.StaticFile(relativePath, filePath)`** -- یک فایل واحد ارائه می‌دهد. مناسب برای نقاط پایانی مانند `/favicon.ico` یا `/robots.txt`.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()
  router.Static("/assets", "./assets")
  router.StaticFS("/more_static", http.Dir("my_file_system"))
  router.StaticFile("/favicon.ico", "./resources/favicon.ico")

  // Listen and serve on 0.0.0.0:8080
  router.Run(":8080")
}
```

:::caution[امنیت: پیمایش مسیر]
دایرکتوری‌ای که به `Static()` یا `http.Dir()` ارسال می‌کنید به طور کامل برای هر کلاینتی قابل دسترسی خواهد بود. مطمئن شوید که شامل فایل‌های حساس مانند فایل‌های پیکربندی، فایل‌های `.env`، کلیدهای خصوصی یا فایل‌های پایگاه داده نیست.

به عنوان بهترین روش:

- از یک دایرکتوری اختصاصی استفاده کنید که فقط شامل فایل‌هایی است که قصد ارائه عمومی آن‌ها را دارید.
- از ارسال مسیرهایی مانند `"."` یا `"/"` که می‌توانند کل پروژه یا سیستم فایل شما را فاش کنند خودداری کنید.
- اگر نیاز به کنترل دقیق‌تر دارید (مثلاً غیرفعال کردن فهرست دایرکتوری‌ها)، از `StaticFS` با پیاده‌سازی سفارشی `http.FileSystem` استفاده کنید. `http.Dir` استاندارد فهرست دایرکتوری را به طور پیش‌فرض فعال می‌کند.
:::
