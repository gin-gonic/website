---
title: "پروکسی‌های مورد اعتماد"
sidebar:
  order: 8
---

Gin به شما اجازه می‌دهد مشخص کنید کدام هدرها IP واقعی کلاینت را نگهداری می‌کنند (در صورت وجود)، و همچنین مشخص کنید به کدام پروکسی‌ها (یا کلاینت‌های مستقیم) برای تنظیم یکی از این هدرها اعتماد دارید.

### چرا پیکربندی پروکسی مورد اعتماد مهم است

وقتی برنامه شما پشت یک پروکسی معکوس (Nginx، HAProxy، متعادل‌کننده بار ابری و غیره) قرار دارد، پروکسی آدرس IP اصلی کلاینت را در هدرهایی مانند `X-Forwarded-For` یا `X-Real-Ip` ارسال می‌کند. مشکل این است که **هر کلاینتی می‌تواند این هدرها را تنظیم کند**. بدون پیکربندی مناسب پروکسی مورد اعتماد، یک مهاجم می‌تواند `X-Forwarded-For` را جعل کند تا:

- **کنترل‌های دسترسی مبتنی بر IP را دور بزند** -- اگر برنامه شما مسیرهای خاصی را به محدوده IP داخلی (مثلاً `10.0.0.0/8`) محدود می‌کند، مهاجم می‌تواند `X-Forwarded-For: 10.0.0.1` را از یک IP عمومی ارسال کرده و محدودیت را کاملاً دور بزند.
- **لاگ‌ها و رد حسابرسی را مسموم کند** -- IPهای جعلی بررسی حوادث را غیرقابل اعتماد می‌کنند زیرا دیگر نمی‌توانید درخواست‌ها را به منبع واقعی ردیابی کنید.
- **محدودیت نرخ را فرار کند** -- اگر محدودیت نرخ بر اساس `ClientIP()` کلید خورده باشد، هر درخواست می‌تواند یک آدرس IP متفاوت ادعا کند تا از throttle شدن جلوگیری کند.

`SetTrustedProxies` این مشکل را با گفتن به Gin حل می‌کند که کدام آدرس‌های شبکه پروکسی‌های مشروع هستند. وقتی `ClientIP()` زنجیره `X-Forwarded-For` را تجزیه می‌کند، فقط به ورودی‌هایی که توسط آن پروکسی‌ها اضافه شده‌اند اعتماد می‌کند و هر چیزی که کلاینت ممکن است اضافه کرده باشد را نادیده می‌گیرد.

از تابع `SetTrustedProxies()` روی `gin.Engine` خود برای مشخص کردن آدرس‌های شبکه یا CIDRهای شبکه استفاده کنید که کلاینت‌ها از آن‌ها هدرهای درخواست مربوط به IP کلاینت قابل اعتماد هستند. آن‌ها می‌توانند آدرس‌های IPv4، CIDRهای IPv4، آدرس‌های IPv6 یا CIDRهای IPv6 باشند.

**توجه:** Gin به طور پیش‌فرض به تمام پروکسی‌ها اعتماد می‌کند اگر با استفاده از تابع بالا یک پروکسی مورد اعتماد مشخص نکنید، **این ایمن نیست**. در عین حال، اگر از هیچ پروکسی‌ای استفاده نمی‌کنید، می‌توانید این ویژگی را با استفاده از `Engine.SetTrustedProxies(nil)` غیرفعال کنید، سپس `Context.ClientIP()` آدرس remote را مستقیماً برمی‌گرداند تا از محاسبات غیرضروری جلوگیری شود.

```go
import (
  "fmt"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()
  router.SetTrustedProxies([]string{"192.168.1.2"})

  router.GET("/", func(c *gin.Context) {
    // If the client is 192.168.1.2, use the X-Forwarded-For
    // header to deduce the original client IP from the trust-
    // worthy parts of that header.
    // Otherwise, simply return the direct client IP
    fmt.Printf("ClientIP: %s\n", c.ClientIP())
  })
  router.Run()
}
```

**توجه:** اگر از سرویس CDN استفاده می‌کنید، می‌توانید `Engine.TrustedPlatform` را تنظیم کنید تا بررسی TrustedProxies را رد کنید، این اولویت بالاتری از TrustedProxies دارد. مثال زیر را ببینید:

```go
import (
  "fmt"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()
  // Use predefined header gin.PlatformXXX
  // Google App Engine
  router.TrustedPlatform = gin.PlatformGoogleAppEngine
  // Cloudflare
  router.TrustedPlatform = gin.PlatformCloudflare
  // Fly.io
  router.TrustedPlatform = gin.PlatformFlyIO
  // Or, you can set your own trusted request header. But be sure your CDN
  // prevents users from passing this header! For example, if your CDN puts
  // the client IP in X-CDN-Client-IP:
  router.TrustedPlatform = "X-CDN-Client-IP"

  router.GET("/", func(c *gin.Context) {
    // If you set TrustedPlatform, ClientIP() will resolve the
    // corresponding header and return IP directly
    fmt.Printf("ClientIP: %s\n", c.ClientIP())
  })
  router.Run()
}
```
