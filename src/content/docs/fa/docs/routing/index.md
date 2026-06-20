---
title: "مسیریابی"
sidebar:
  order: 3
---

Gin یک سیستم مسیریابی قدرتمند مبتنی بر [httprouter](https://github.com/julienschmidt/httprouter) برای تطبیق URL با عملکرد بالا ارائه می‌دهد. در پشت صحنه، httprouter از [درخت Radix](https://en.wikipedia.org/wiki/Radix_tree) (که به آن trie فشرده نیز گفته می‌شود) برای ذخیره و جستجوی مسیرها استفاده می‌کند، به این معنی که تطبیق مسیر بسیار سریع است و نیاز به تخصیص حافظه صفر در هر جستجو دارد. این ویژگی Gin را به یکی از سریع‌ترین فریم‌ورک‌های وب Go تبدیل می‌کند.

مسیرها با فراخوانی یک متد HTTP روی موتور (یا یک گروه مسیر) و ارائه یک الگوی URL به همراه یک یا چند تابع handler ثبت می‌شوند:

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.GET("/hello", func(c *gin.Context) {
    c.String(http.StatusOK, "Hello, World!")
  })

  router.POST("/users", func(c *gin.Context) {
    name := c.PostForm("name")
    c.JSON(http.StatusCreated, gin.H{"user": name})
  })

  router.Run(":8080")
}
```

## در این بخش

صفحات زیر هر موضوع مسیریابی را به تفصیل پوشش می‌دهند:

- [**استفاده از متد HTTP**](./http-method/) -- ثبت مسیرها برای GET، POST، PUT، DELETE، PATCH، HEAD و OPTIONS.
- [**پارامترها در مسیر**](./param-in-path/) -- گرفتن بخش‌های پویا از مسیرهای URL (مثلاً `/user/:name`).
- [**پارامترهای رشته پرس‌وجو**](./querystring-param/) -- خواندن مقادیر رشته پرس‌وجو از URL درخواست.
- [**فرم پرس‌وجو و ارسال**](./query-and-post-form/) -- دسترسی به هر دو داده رشته پرس‌وجو و فرم POST در یک handler.
- [**Map به عنوان رشته پرس‌وجو یا فرم ارسال**](./map-as-querystring-or-postform/) -- اتصال پارامترهای map از رشته‌های پرس‌وجو یا فرم‌های POST.
- [**فرم Multipart/urlencoded**](./multipart-urlencoded-form/) -- تجزیه بدنه‌های `multipart/form-data` و `application/x-www-form-urlencoded`.
- [**آپلود فایل‌ها**](./upload-file/) -- مدیریت آپلود تک فایل و چند فایل.
- [**گروه‌بندی مسیرها**](./grouping-routes/) -- سازماندهی مسیرها تحت پیشوندهای مشترک با میان‌افزار مشترک.
- [**تغییر مسیرها**](./redirects/) -- انجام تغییر مسیرهای HTTP و سطح روتر.
