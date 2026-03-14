---
title: "SecureJSON"
sidebar:
  order: 2
---

يحمي `SecureJSON` من فئة من الثغرات تُعرف بـ **اختطاف JSON**. في المتصفحات القديمة (بشكل رئيسي Internet Explorer 9 والإصدارات الأقدم)، يمكن لصفحة خبيثة تضمين علامة `<script>` تشير إلى نقطة نهاية JSON API للضحية. إذا أعادت نقطة النهاية مصفوفة JSON على المستوى الأعلى (مثل `["secret","data"]`)، سينفذها المتصفح كـ JavaScript. عن طريق تجاوز مُنشئ `Array`، يمكن للمهاجم اعتراض القيم المُحللة وتسريب البيانات الحساسة إلى خادم طرف ثالث.

**كيف يمنع SecureJSON ذلك:**

عندما تكون بيانات الاستجابة مصفوفة JSON، يُضيف `SecureJSON` بادئة غير قابلة للتحليل -- بشكل افتراضي `while(1);` -- إلى جسم الاستجابة. هذا يتسبب في دخول محرك JavaScript في المتصفح في حلقة لا نهائية إذا تم تحميل الاستجابة عبر علامة `<script>`، مما يمنع الوصول إلى البيانات. مستهلكو الواجهة البرمجية الشرعيون (الذين يستخدمون `fetch` أو `XMLHttpRequest` أو أي عميل HTTP) يقرؤون جسم الاستجابة الخام ويمكنهم ببساطة إزالة البادئة قبل التحليل.

تستخدم واجهات Google البرمجية تقنية مشابهة مع `)]}'\n`، ويستخدم Facebook `for(;;);`. يمكنك تخصيص البادئة باستخدام `router.SecureJsonPrefix()`.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  // You can also use your own secure json prefix
  // router.SecureJsonPrefix(")]}',\n")

  router.GET("/someJSON", func(c *gin.Context) {
    names := []string{"lena", "austin", "foo"}

    // Will output  :   while(1);["lena","austin","foo"]
    c.SecureJSON(http.StatusOK, names)
  })

  // Listen and serve on 0.0.0.0:8080
  router.Run(":8080")
}
```

:::note
أصلحت المتصفحات الحديثة هذه الثغرة، لذا `SecureJSON` مهم بشكل أساسي إذا كنت بحاجة لدعم متصفحات قديمة أو إذا كانت سياسة الأمان لديك تتطلب الدفاع متعدد الطبقات. بالنسبة لمعظم الواجهات البرمجية الجديدة، يكفي استخدام `c.JSON()` القياسي.
:::
