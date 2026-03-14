---
title: "پیکربندی سرور"
sidebar:
  order: 8
---

Gin گزینه‌های پیکربندی سرور انعطاف‌پذیری ارائه می‌دهد. از آنجا که `gin.Engine` رابط `http.Handler` را پیاده‌سازی می‌کند، می‌توانید از آن با `net/http.Server` استاندارد Go برای کنترل مستقیم timeoutها، TLS و سایر تنظیمات استفاده کنید.

## استفاده از http.Server سفارشی

به طور پیش‌فرض، `router.Run()` یک سرور HTTP پایه راه‌اندازی می‌کند. برای استفاده در تولید، `http.Server` خود را برای تنظیم timeoutها و سایر گزینه‌ها ایجاد کنید:

```go
func main() {
  router := gin.Default()
  router.GET("/", func(c *gin.Context) {
    c.String(200, "ok")
  })

  s := &http.Server{
    Addr:           ":8080",
    Handler:        router,
    ReadTimeout:    10 * time.Second,
    WriteTimeout:   10 * time.Second,
    MaxHeaderBytes: 1 << 20,
  }
  s.ListenAndServe()
}
```

این به شما دسترسی کامل به پیکربندی سرور Go را می‌دهد در حالی که تمام قابلیت‌های مسیریابی و میان‌افزار Gin حفظ می‌شود.

## در این بخش

- [**پیکربندی HTTP سفارشی**](./custom-http-config/) -- تنظیم دقیق سرور HTTP زیربنایی
- [**کدک JSON سفارشی**](./custom-json-codec/) -- استفاده از کتابخانه‌های سریال‌سازی JSON جایگزین
- [**Let's Encrypt**](./lets-encrypt/) -- گواهی‌های TLS خودکار با Let's Encrypt
- [**اجرای سرویس‌های متعدد**](./multiple-service/) -- ارائه چندین موتور Gin روی پورت‌های مختلف
- [**راه‌اندازی مجدد یا توقف آرام**](./graceful-restart-or-stop/) -- خاموشی بدون قطع اتصالات فعال
- [**HTTP/2 server push**](./http2-server-push/) -- ارسال پیشگیرانه منابع به کلاینت
- [**مدیریت کوکی**](./cookie/) -- خواندن و نوشتن کوکی‌های HTTP
- [**پروکسی‌های مورد اعتماد**](./trusted-proxies/) -- پیکربندی پروکسی‌هایی که Gin برای تعیین IP کلاینت به آن‌ها اعتماد می‌کند
