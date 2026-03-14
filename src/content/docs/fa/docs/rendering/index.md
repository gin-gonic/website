---
title: "رندرینگ"
sidebar:
  order: 5
---

Gin از رندرینگ پاسخ‌ها در چندین فرمت از جمله JSON، XML، YAML، ProtoBuf، HTML و موارد دیگر پشتیبانی می‌کند. هر متد رندرینگ از همان الگو پیروی می‌کند: فراخوانی یک متد روی `*gin.Context` با یک کد وضعیت HTTP و داده‌ها برای سریال‌سازی. Gin هدرهای content-type، سریال‌سازی و نوشتن پاسخ را به طور خودکار مدیریت می‌کند.

```go
// All rendering methods share this pattern:
c.JSON(http.StatusOK, data)   // application/json
c.XML(http.StatusOK, data)    // application/xml
c.YAML(http.StatusOK, data)   // application/x-yaml
c.TOML(http.StatusOK, data)   // application/toml
c.ProtoBuf(http.StatusOK, data) // application/x-protobuf
```

می‌توانید از هدر `Accept` یا یک پارامتر پرس‌وجو برای ارائه همان داده‌ها در فرمت‌های مختلف از یک handler استفاده کنید:

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.GET("/user", func(c *gin.Context) {
    user := gin.H{"name": "Lena", "role": "admin"}

    switch c.Query("format") {
    case "xml":
      c.XML(http.StatusOK, user)
    case "yaml":
      c.YAML(http.StatusOK, user)
    default:
      c.JSON(http.StatusOK, user)
    }
  })

  router.Run(":8080")
}
```

## در این بخش

- [**رندرینگ XML/JSON/YAML/ProtoBuf**](./rendering/) -- رندرینگ پاسخ‌ها در فرمت‌های مختلف با مدیریت خودکار content-type
- [**SecureJSON**](./secure-json/) -- جلوگیری از حملات ربودن JSON در مرورگرهای قدیمی
- [**JSONP**](./jsonp/) -- پشتیبانی از درخواست‌های بین‌دامنه‌ای از کلاینت‌های قدیمی بدون CORS
- [**AsciiJSON**](./ascii-json/) -- فرار از کاراکترهای غیر ASCII برای انتقال امن
- [**PureJSON**](./pure-json/) -- رندرینگ JSON بدون فرار از کاراکترهای HTML
- [**ارائه فایل‌های استاتیک**](./serving-static-files/) -- ارائه دایرکتوری‌های دارایی‌های استاتیک
- [**ارائه داده از فایل**](./serving-data-from-file/) -- ارائه فایل‌های منفرد، پیوست‌ها و دانلودها
- [**ارائه داده از reader**](./serving-data-from-reader/) -- جریان‌سازی داده از هر `io.Reader` به پاسخ
- [**رندرینگ HTML**](./html-rendering/) -- رندرینگ قالب‌های HTML با داده‌های پویا
- [**قالب‌های متعدد**](./multiple-template/) -- استفاده از مجموعه‌های قالب متعدد در یک برنامه
- [**ترکیب باینری واحد با قالب**](./bind-single-binary-with-template/) -- جاگذاری قالب‌ها در باینری کامپایل شده
