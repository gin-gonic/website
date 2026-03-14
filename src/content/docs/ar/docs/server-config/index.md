---
title: "تكوين الخادم"
sidebar:
  order: 8
---

يوفر Gin خيارات تكوين خادم مرنة. نظراً لأن `gin.Engine` ينفّذ واجهة `http.Handler`، يمكنك استخدامه مع `net/http.Server` القياسي في Go للتحكم في المهل الزمنية وTLS والإعدادات الأخرى مباشرة.

## استخدام http.Server مخصص

افتراضياً، يبدأ `router.Run()` خادم HTTP أساسي. للاستخدام في بيئة الإنتاج، أنشئ `http.Server` الخاص بك لتعيين المهل الزمنية والخيارات الأخرى:

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

هذا يمنحك وصولاً كاملاً لتكوين خادم Go مع الاحتفاظ بجميع إمكانيات التوجيه والوسيطات في Gin.

## في هذا القسم

- [**تكوين HTTP مخصص**](./custom-http-config/) -- ضبط خادم HTTP الأساسي
- [**مُرمّز JSON مخصص**](./custom-json-codec/) -- استخدام مكتبات تسلسل JSON بديلة
- [**Let's Encrypt**](./lets-encrypt/) -- شهادات TLS تلقائية مع Let's Encrypt
- [**تشغيل خدمات متعددة**](./multiple-service/) -- تقديم عدة محركات Gin على منافذ مختلفة
- [**إعادة التشغيل أو الإيقاف الرشيق**](./graceful-restart-or-stop/) -- الإيقاف بدون إسقاط الاتصالات النشطة
- [**دفع خادم HTTP/2**](./http2-server-push/) -- دفع الموارد إلى العميل بشكل استباقي
- [**معالجة ملفات تعريف الارتباط**](./cookie/) -- قراءة وكتابة ملفات تعريف ارتباط HTTP
- [**الوكلاء الموثوقون**](./trusted-proxies/) -- تكوين الوكلاء التي يثق بها Gin لتحديد عنوان IP للعميل
