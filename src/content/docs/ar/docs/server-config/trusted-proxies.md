---
title: "الوكلاء الموثوقون"
sidebar:
  order: 8
---

يتيح لك Gin تحديد الترويسات التي تحمل عنوان IP الحقيقي للعميل (إن وُجدت)، بالإضافة إلى تحديد الوكلاء (أو العملاء المباشرين) الذين تثق بهم لتعيين إحدى هذه الترويسات.

### لماذا تكوين الوكلاء الموثوقين مهم

عندما يكون تطبيقك خلف وكيل عكسي (Nginx، HAProxy، موازن حمل سحابي، إلخ)، يمرر الوكيل عنوان IP الأصلي للعميل في ترويسات مثل `X-Forwarded-For` أو `X-Real-Ip`. المشكلة هي أن **أي عميل يمكنه تعيين هذه الترويسات**. بدون تكوين وكلاء موثوقين صحيح، يمكن للمهاجم تزوير `X-Forwarded-For` من أجل:

- **تجاوز ضوابط الوصول المبنية على IP** -- إذا كان تطبيقك يقيّد مسارات معينة لنطاق IP داخلي (مثل `10.0.0.0/8`)، يمكن للمهاجم إرسال `X-Forwarded-For: 10.0.0.1` من IP عام وتجاوز القيد بالكامل.
- **تسميم السجلات ومسارات التدقيق** -- عناوين IP المزورة تجعل التحقيق في الحوادث غير موثوق لأنه لم يعد بإمكانك تتبع الطلبات إلى مصدرها الحقيقي.
- **التهرب من تحديد المعدل** -- إذا كان تحديد المعدل مبنياً على `ClientIP()`، يمكن لكل طلب ادعاء عنوان IP مختلف لتجنب التقييد.

تحل `SetTrustedProxies` هذه المشكلة بإخبار Gin بعناوين الشبكة التي هي وكلاء شرعيين. عندما يحلل `ClientIP()` سلسلة `X-Forwarded-For`، يثق فقط بالإدخالات المضافة من تلك الوكلاء ويتجاهل أي شيء قد يكون العميل أضافه. إذا وصل طلب مباشرة (ليس من وكيل موثوق)، يتم تجاهل ترويسات التمرير بالكامل ويُستخدم العنوان البعيد الخام.

استخدم دالة `SetTrustedProxies()` على `gin.Engine` لتحديد عناوين الشبكة أو نطاقات CIDR التي يمكن الوثوق بترويسات طلباتها المتعلقة بعنوان IP للعميل. يمكن أن تكون عناوين IPv4 أو نطاقات CIDR لـ IPv4 أو عناوين IPv6 أو نطاقات CIDR لـ IPv6.

**تنبيه:** يثق Gin بجميع الوكلاء افتراضياً إذا لم تحدد وكيلاً موثوقاً باستخدام الدالة أعلاه، **هذا ليس آمناً**. في نفس الوقت، إذا لم تستخدم أي وكيل، يمكنك تعطيل هذه الميزة باستخدام `Engine.SetTrustedProxies(nil)`، وعندها سيُرجع `Context.ClientIP()` العنوان البعيد مباشرة لتجنب بعض الحسابات غير الضرورية.

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

**ملاحظة:** إذا كنت تستخدم خدمة CDN، يمكنك تعيين `Engine.TrustedPlatform` لتخطي فحص TrustedProxies، فله أولوية أعلى من TrustedProxies.
انظر المثال أدناه:

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
