---
title: "استقرار"
sidebar:
  order: 10
---

پروژه‌های Gin به راحتی روی هر ارائه‌دهنده ابری قابل استقرار هستند.

## [Railway](https://www.railway.com)

Railway یک پلتفرم توسعه ابری پیشرفته برای استقرار، مدیریت و مقیاس‌بندی برنامه‌ها و سرویس‌ها است. این پلتفرم پشته زیرساخت شما را از سرورها تا قابلیت مشاهده با یک پلتفرم واحد، مقیاس‌پذیر و آسان ساده می‌کند.

راهنمای Railway برای [استقرار پروژه‌های Gin](https://docs.railway.com/guides/gin) را دنبال کنید.

## [Seenode](https://seenode.com)

Seenode یک پلتفرم ابری مدرن است که به طور خاص برای توسعه‌دهندگانی طراحی شده که می‌خواهند برنامه‌ها را سریع و کارآمد مستقر کنند. استقرار مبتنی بر git، گواهی‌های SSL خودکار، پایگاه‌های داده داخلی و یک رابط ساده ارائه می‌دهد که برنامه‌های Gin شما را در عرض چند دقیقه فعال می‌کند.

راهنمای Seenode برای [استقرار پروژه‌های Gin](https://seenode.com/docs/frameworks/go/gin) را دنبال کنید.

## [Koyeb](https://www.koyeb.com)

Koyeb یک پلتفرم serverless دوستدار توسعه‌دهنده برای استقرار جهانی برنامه‌ها با استقرار مبتنی بر git، رمزنگاری TLS، مقیاس‌بندی خودکار بومی، شبکه edge جهانی و service mesh و discovery داخلی است.

راهنمای Koyeb برای [استقرار پروژه‌های Gin](https://www.koyeb.com/tutorials/deploy-go-gin-on-koyeb) را دنبال کنید.

## [Qovery](https://www.qovery.com)

Qovery میزبانی رایگان ابری با پایگاه‌های داده، SSL، CDN جهانی و استقرار خودکار با Git ارائه می‌دهد.

برای اطلاعات بیشتر [Qovery](https://hub.qovery.com/guides/getting-started/deploy-your-first-application/) را ببینید.

## [Render](https://render.com)

Render یک پلتفرم ابری مدرن است که پشتیبانی بومی از Go، SSL کاملاً مدیریت شده، پایگاه‌های داده، استقرار بدون قطعی، HTTP/2 و پشتیبانی websocket ارائه می‌دهد.

راهنمای Render برای [استقرار پروژه‌های Gin](https://render.com/docs/deploy-go-gin) را دنبال کنید.

## [Google App Engine](https://cloud.google.com/appengine/)

GAE دو روش برای استقرار برنامه‌های Go دارد. محیط استاندارد استفاده آسان‌تری دارد اما قابلیت سفارشی‌سازی کمتری دارد و به دلایل امنیتی [فراخوانی‌های سیستمی](https://github.com/gin-gonic/gin/issues/1639) را ممنوع می‌کند. محیط انعطاف‌پذیر می‌تواند هر فریم‌ورک یا کتابخانه‌ای را اجرا کند.

بیشتر بیاموزید و محیط مورد نظر خود را در [Go on Google App Engine](https://cloud.google.com/appengine/docs/go/) انتخاب کنید.

## میزبانی شخصی

پروژه‌های Gin همچنین می‌توانند به صورت خودمیزبان مستقر شوند. معماری استقرار و ملاحظات امنیتی بسته به محیط هدف متفاوت است. بخش زیر فقط یک نمای کلی از گزینه‌های پیکربندی قابل بررسی هنگام برنامه‌ریزی استقرار ارائه می‌دهد.

## گزینه‌های پیکربندی

استقرار پروژه‌های Gin با استفاده از متغیرهای محیطی یا مستقیماً در کد قابل تنظیم است.

متغیرهای محیطی زیر برای پیکربندی Gin موجود هستند:

| متغیر محیطی | توضیحات |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PORT                 | پورت TCP برای گوش دادن هنگام شروع سرور Gin با `router.Run()` (یعنی بدون آرگومان). |
| GIN_MODE             | یکی از `debug`، `release` یا `test` را تنظیم کنید. مدیریت حالت‌های Gin مانند زمان تولید خروجی‌های اشکال‌زدایی را کنترل می‌کند. همچنین می‌توان در کد با `gin.SetMode(gin.ReleaseMode)` یا `gin.SetMode(gin.TestMode)` تنظیم کرد. |

کد زیر می‌تواند برای پیکربندی Gin استفاده شود.

```go
// Don't specify the bind address or port for Gin. Defaults to binding on all interfaces on port 8080.
// Can use the `PORT` environment variable to change the listen port when using `Run()` without any arguments.
router := gin.Default()
router.Run()

// Specify the bind address and port for Gin.
router := gin.Default()
router.Run("192.168.1.100:8080")

// Specify only the listen port. Will bind on all interfaces.
router := gin.Default()
router.Run(":8080")

// Set which IP addresses or CIDRs, are considered to be trusted for setting headers to document real client IP addresses.
// See the documentation for additional details.
router := gin.Default()
router.SetTrustedProxies([]string{"192.168.1.2"})
```

برای اطلاعات درباره پیکربندی پروکسی‌های مورد اعتماد، [پروکسی‌های مورد اعتماد](/fa/docs/server-config/trusted-proxies/) را ببینید.
