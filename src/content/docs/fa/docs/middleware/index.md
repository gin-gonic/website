---
title: "میان‌افزار"
sidebar:
  order: 6
---

میان‌افزار در Gin راهی برای پردازش درخواست‌های HTTP قبل از رسیدن به handlerهای مسیر فراهم می‌کند. یک تابع میان‌افزار همان امضای handler مسیر -- `gin.HandlerFunc` -- را دارد و معمولاً `c.Next()` را برای انتقال کنترل به handler بعدی در زنجیره فراخوانی می‌کند.

## نحوه کار میان‌افزار

Gin از **مدل پیاز** برای اجرای میان‌افزار استفاده می‌کند. هر میان‌افزار در دو مرحله اجرا می‌شود:

1. **قبل از handler** -- کد قبل از `c.Next()` قبل از handler مسیر اجرا می‌شود.
2. **بعد از handler** -- کد بعد از `c.Next()` پس از بازگشت handler مسیر اجرا می‌شود.

این به این معنی است که میان‌افزار مانند لایه‌های پیاز دور handler قرار می‌گیرد. اولین میان‌افزار متصل شده، بیرونی‌ترین لایه است.

```go
func Logger() gin.HandlerFunc {
  return func(c *gin.Context) {
    start := time.Now()

    // Pre-handler phase
    c.Next()

    // Post-handler phase
    latency := time.Since(start)
    log.Printf("Request took %v", latency)
  }
}
```

## اتصال میان‌افزار

سه روش برای اتصال میان‌افزار در Gin وجود دارد:

```go
// 1. Global -- applies to all routes
router := gin.New()
router.Use(Logger(), Recovery())

// 2. Group -- applies to all routes in the group
v1 := router.Group("/v1")
v1.Use(AuthRequired())
{
  v1.GET("/users", listUsers)
}

// 3. Per-route -- applies to a single route
router.GET("/benchmark", BenchmarkMiddleware(), benchHandler)
```

میان‌افزار متصل شده در محدوده وسیع‌تر ابتدا اجرا می‌شود. در مثال بالا، یک درخواست به `GET /v1/users` به ترتیب `Logger` سپس `Recovery` سپس `AuthRequired` سپس `listUsers` را اجرا خواهد کرد.

## در این بخش

- [**استفاده از میان‌افزار**](./using-middleware/) -- اتصال میان‌افزار به صورت سراسری، به گروه‌ها یا مسیرهای منفرد
- [**میان‌افزار سفارشی**](./custom-middleware/) -- نوشتن توابع میان‌افزار خود
- [**استفاده از میان‌افزار BasicAuth**](./using-basicauth/) -- احراز هویت پایه HTTP
- [**گوروتین‌ها در میان‌افزار**](./goroutines-inside-middleware/) -- اجرای امن وظایف پس‌زمینه از میان‌افزار
- [**پیکربندی HTTP سفارشی**](./custom-http-config/) -- مدیریت خطا و بازیابی در میان‌افزار
- [**هدرهای امنیتی**](./security-headers/) -- تنظیم هدرهای امنیتی رایج
