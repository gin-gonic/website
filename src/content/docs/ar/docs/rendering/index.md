---
title: "العرض"
sidebar:
  order: 5
---

يدعم Gin عرض الاستجابات بتنسيقات متعددة بما في ذلك JSON وXML وYAML وProtoBuf وHTML والمزيد. تتبع جميع طرق العرض نفس النمط: استدعاء طريقة على `*gin.Context` مع رمز حالة HTTP والبيانات المراد تسلسلها. يتعامل Gin مع ترويسات نوع المحتوى والتسلسل وكتابة الاستجابة تلقائياً.

```go
// All rendering methods share this pattern:
c.JSON(http.StatusOK, data)   // application/json
c.XML(http.StatusOK, data)    // application/xml
c.YAML(http.StatusOK, data)   // application/x-yaml
c.TOML(http.StatusOK, data)   // application/toml
c.ProtoBuf(http.StatusOK, data) // application/x-protobuf
```

يمكنك استخدام ترويسة `Accept` أو معامل استعلام لتقديم نفس البيانات بتنسيقات متعددة من معالج واحد:

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

## في هذا القسم

- [**عرض XML/JSON/YAML/ProtoBuf**](./rendering/) -- عرض الاستجابات بتنسيقات متعددة مع معالجة تلقائية لنوع المحتوى
- [**SecureJSON**](./secure-json/) -- منع هجمات اختطاف JSON في المتصفحات القديمة
- [**JSONP**](./jsonp/) -- دعم الطلبات عبر النطاقات من العملاء القدامى بدون CORS
- [**AsciiJSON**](./ascii-json/) -- ترميز الأحرف غير ASCII للنقل الآمن
- [**PureJSON**](./pure-json/) -- عرض JSON بدون ترميز أحرف HTML
- [**تقديم الملفات الثابتة**](./serving-static-files/) -- تقديم مجلدات الأصول الثابتة
- [**تقديم البيانات من ملف**](./serving-data-from-file/) -- تقديم ملفات فردية ومرفقات وتنزيلات
- [**تقديم البيانات من قارئ**](./serving-data-from-reader/) -- بث البيانات من أي `io.Reader` إلى الاستجابة
- [**عرض HTML**](./html-rendering/) -- عرض قوالب HTML مع بيانات ديناميكية
- [**قوالب متعددة**](./multiple-template/) -- استخدام مجموعات قوالب متعددة في تطبيق واحد
- [**تضمين القوالب في ملف ثنائي واحد**](./bind-single-binary-with-template/) -- تضمين القوالب في الملف الثنائي المُترجم
