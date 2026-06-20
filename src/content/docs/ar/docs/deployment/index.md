---
title: "النشر"
sidebar:
  order: 10
---

يمكن نشر مشاريع Gin بسهولة على أي مزود سحابي.

## [Railway](https://www.railway.com)

Railway هي منصة تطوير سحابية متقدمة لنشر وإدارة وتوسيع التطبيقات والخدمات. تُبسّط مجموعة البنية التحتية من الخوادم إلى المراقبة بمنصة واحدة قابلة للتوسع وسهلة الاستخدام.

اتبع [دليل Railway لنشر مشاريع Gin](https://docs.railway.com/guides/gin).

## [Seenode](https://seenode.com)

Seenode هي منصة سحابية حديثة مصممة خصيصاً للمطورين الذين يريدون نشر التطبيقات بسرعة وكفاءة. توفر نشراً مبنياً على Git وشهادات SSL تلقائية وقواعد بيانات مدمجة وواجهة مبسطة تجعل تطبيقات Gin تعمل في دقائق.

اتبع [دليل Seenode لنشر مشاريع Gin](https://seenode.com/docs/frameworks/go/gin).

## [Koyeb](https://www.koyeb.com)

Koyeb هي منصة بدون خادم صديقة للمطورين لنشر التطبيقات عالمياً مع نشر مبني على Git وتشفير TLS وتوسع تلقائي أصلي وشبكة حافة عالمية وشبكة خدمات واكتشاف مدمجة.

اتبع [دليل Koyeb لنشر مشاريع Gin](https://www.koyeb.com/tutorials/deploy-go-gin-on-koyeb).

## [Qovery](https://www.qovery.com)

توفر Qovery استضافة سحابية مجانية مع قواعد بيانات وSSL وCDN عالمي ونشر تلقائي مع Git.

راجع [Qovery](https://hub.qovery.com/guides/getting-started/deploy-your-first-application/) لمزيد من المعلومات.

## [Render](https://render.com)

Render هي منصة سحابية حديثة توفر دعماً أصلياً لـ Go وSSL مُدار بالكامل وقواعد بيانات ونشر بدون توقف ودعم HTTP/2 وWebSocket.

اتبع [دليل Render لنشر مشاريع Gin](https://render.com/docs/deploy-go-gin).

## [Google App Engine](https://cloud.google.com/appengine/)

يوفر GAE طريقتين لنشر تطبيقات Go. البيئة القياسية أسهل في الاستخدام لكنها أقل قابلية للتخصيص وتمنع [استدعاءات النظام](https://github.com/gin-gonic/gin/issues/1639) لأسباب أمنية. البيئة المرنة يمكنها تشغيل أي إطار عمل أو مكتبة.

تعرّف على المزيد واختر بيئتك المفضلة في [Go على Google App Engine](https://cloud.google.com/appengine/docs/go/).

## الاستضافة الذاتية

يمكن أيضاً نشر مشاريع Gin بطريقة الاستضافة الذاتية. تختلف بنية النشر واعتبارات الأمان حسب البيئة المستهدفة. يقدم القسم التالي نظرة عامة عالية المستوى فقط على خيارات التكوين التي يجب مراعاتها عند التخطيط للنشر.

## خيارات التكوين

يمكن ضبط نشر مشاريع Gin باستخدام متغيرات البيئة أو مباشرة في الكود.

متغيرات البيئة التالية متاحة لتكوين Gin:

| متغير البيئة | الوصف                                                                                                                                                                                                   |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PORT                 | منفذ TCP للاستماع عند بدء خادم Gin باستخدام `router.Run()` (أي بدون أي وسيطات).                                                                                                      |
| GIN_MODE             | يُعيّن إلى `debug` أو `release` أو `test`. يتعامل مع إدارة أوضاع Gin، مثل متى يتم إصدار مخرجات التصحيح. يمكن أيضاً تعيينه في الكود باستخدام `gin.SetMode(gin.ReleaseMode)` أو `gin.SetMode(gin.TestMode)` |

يمكن استخدام الكود التالي لتكوين Gin:

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

لمعلومات حول تكوين الوكلاء الموثوقين، راجع [الوكلاء الموثوقون](/ar/docs/server-config/trusted-proxies/).
