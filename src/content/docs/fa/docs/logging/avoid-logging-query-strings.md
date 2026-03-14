---
title: "جلوگیری از لاگ‌گذاری رشته‌های پرس‌وجو"
sidebar:
  order: 5
---

رشته‌های پرس‌وجو اغلب شامل اطلاعات حساس مانند توکن‌های API، رمزهای عبور، شناسه‌های نشست یا اطلاعات شناسایی شخصی (PII) هستند. لاگ‌گذاری این مقادیر می‌تواند ریسک‌های امنیتی ایجاد کند و ممکن است مقررات حریم خصوصی مانند GDPR یا HIPAA را نقض کند. با حذف رشته‌های پرس‌وجو از لاگ‌ها، احتمال نشت داده‌های حساس از طریق فایل‌های لاگ، سیستم‌های نظارت یا ابزارهای گزارش خطا را کاهش می‌دهید.

از گزینه `SkipQueryString` در `LoggerConfig` برای جلوگیری از ظاهر شدن رشته‌های پرس‌وجو در لاگ‌ها استفاده کنید. وقتی فعال باشد، درخواستی به `/path?token=secret&user=alice` به سادگی به عنوان `/path` لاگ می‌شود.

```go
func main() {
  router := gin.New()

  // SkipQueryString indicates that the logger should not log the query string.
  // For example, /path?q=1 will be logged as /path
  loggerConfig := gin.LoggerConfig{SkipQueryString: true}

  router.Use(gin.LoggerWithConfig(loggerConfig))
  router.Use(gin.Recovery())

  router.GET("/search", func(c *gin.Context) {
    q := c.Query("q")
    c.String(200, "searching for: "+q)
  })

  router.Run(":8080")
}
```

می‌توانید تفاوت را با `curl` تست کنید:

```bash
curl "http://localhost:8080/search?q=gin&token=secret123"
```

بدون `SkipQueryString`، ورودی لاگ شامل رشته پرس‌وجوی کامل است:

```
[GIN] 2025/06/01 - 15:04:05 | 200 |     102.4µs |       127.0.0.1 | GET      "/search?q=gin&token=secret123"
```

با `SkipQueryString: true`، رشته پرس‌وجو حذف می‌شود:

```
[GIN] 2025/06/01 - 15:04:05 | 200 |     102.4µs |       127.0.0.1 | GET      "/search"
```

این به ویژه در محیط‌های حساس به انطباق مفید است که خروجی لاگ به سرویس‌های شخص ثالث ارسال یا بلندمدت ذخیره می‌شود. برنامه شما همچنان از طریق `c.Query()` دسترسی کامل به پارامترهای پرس‌وجو دارد -- فقط خروجی لاگ تحت تأثیر قرار می‌گیرد.
