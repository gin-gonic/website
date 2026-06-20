---
title: "تقديم البيانات من قارئ"
sidebar:
  order: 8
---

يتيح لك `DataFromReader` بث البيانات من أي `io.Reader` مباشرة إلى استجابة HTTP دون تخزين المحتوى بالكامل في الذاكرة أولاً. هذا ضروري لبناء نقاط نهاية الوكيل أو تقديم ملفات كبيرة من مصادر بعيدة بكفاءة.

**حالات الاستخدام الشائعة:**

- **توكيل الموارد البعيدة** -- جلب ملف من خدمة خارجية (مثل واجهة تخزين سحابي أو CDN) وإعادة توجيهه إلى العميل. تتدفق البيانات عبر خادمك دون تحميلها بالكامل في الذاكرة.
- **تقديم محتوى مُولّد** -- بث بيانات مُولّدة ديناميكياً (مثل تصدير CSV أو ملفات التقارير) أثناء إنتاجها.
- **تنزيلات الملفات الكبيرة** -- تقديم ملفات أكبر من أن تُحفظ في الذاكرة، عن طريق قراءتها على أجزاء من القرص أو من مصدر بعيد.

صيغة الطريقة هي `c.DataFromReader(code, contentLength, contentType, reader, extraHeaders)`. تقدم رمز حالة HTTP وطول المحتوى (ليعرف العميل الحجم الكلي) ونوع MIME و`io.Reader` للبث منه وخريطة اختيارية من ترويسات الاستجابة الإضافية (مثل `Content-Disposition` لتنزيل الملفات).

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()
  router.GET("/someDataFromReader", func(c *gin.Context) {
    response, err := http.Get("https://raw.githubusercontent.com/gin-gonic/logo/master/color.png")
    if err != nil || response.StatusCode != http.StatusOK {
      c.Status(http.StatusServiceUnavailable)
      return
    }

    reader := response.Body
    contentLength := response.ContentLength
    contentType := response.Header.Get("Content-Type")

    extraHeaders := map[string]string{
      "Content-Disposition": `attachment; filename="gopher.png"`,
    }

    c.DataFromReader(http.StatusOK, contentLength, contentType, reader, extraHeaders)
  })
  router.Run(":8080")
}
```

في هذا المثال، يجلب Gin صورة من GitHub ويبثها مباشرة إلى العميل كمرفق قابل للتنزيل. تتدفق بايتات الصورة من جسم استجابة HTTP العلوي مروراً إلى استجابة العميل دون تراكمها في مخزن مؤقت. لاحظ أن `response.Body` يُغلق تلقائياً بواسطة خادم HTTP بعد إرجاع المعالج، حيث يقرأه `DataFromReader` بالكامل أثناء كتابة الاستجابة.
