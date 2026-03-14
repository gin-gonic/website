---
title: "JSONP"
sidebar:
  order: 3
---

JSONP (JSON مع الحشو) هي تقنية لإجراء طلبات عبر النطاقات من المتصفحات التي سبقت دعم CORS. تعمل عن طريق لف استجابة JSON في استدعاء دالة JavaScript. يحمّل المتصفح الاستجابة عبر علامة `<script>`، التي لا تخضع لسياسة نفس المصدر، وتُنفذ الدالة الملفوفة مع البيانات كوسيطتها.

عند استدعاء `c.JSONP()`، يتحقق Gin من معامل استعلام `callback`. إذا كان موجوداً، يُلف جسم الاستجابة كـ `callbackName({"foo":"bar"})` مع `Content-Type` من `application/javascript`. إذا لم يُقدم callback، تتصرف الاستجابة مثل استدعاء `c.JSON()` القياسي.

:::note
JSONP هي تقنية قديمة. للتطبيقات الحديثة، استخدم [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) بدلاً منها. CORS أكثر أماناً، ويدعم جميع طرق HTTP (وليس فقط GET)، ولا يتطلب لف الاستجابات في callbacks. استخدم JSONP فقط عندما تحتاج لدعم متصفحات قديمة جداً أو التكامل مع أنظمة طرف ثالث تتطلبه.
:::

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.GET("/JSONP", func(c *gin.Context) {
    data := map[string]interface{}{
      "foo": "bar",
    }

    // The callback name is read from the query string, e.g.:
    // GET /JSONP?callback=x
    // Will output  :   x({\"foo\":\"bar\"})
    c.JSONP(http.StatusOK, data)
  })

  // Listen and serve on 0.0.0.0:8080
  router.Run(":8080")
}
```

اختبرها باستخدام curl لرؤية الفرق بين استجابات JSONP وJSON العادية:

```sh
# With callback -- returns JavaScript
curl "http://localhost:8080/JSONP?callback=handleData"
# Output: handleData({"foo":"bar"});

# Without callback -- returns plain JSON
curl "http://localhost:8080/JSONP"
# Output: {"foo":"bar"}
```

:::caution[اعتبارات أمنية]
يمكن أن تكون نقاط نهاية JSONP عرضة لهجمات XSS إذا لم يُنظّف معامل callback بشكل صحيح. قيمة callback خبيثة مثل `alert(document.cookie)//` يمكن أن تحقن JavaScript عشوائي. يخفف Gin من ذلك بتنظيف اسم callback وإزالة الأحرف التي يمكن استخدامها للحقن. ومع ذلك، يجب أن تقصر نقاط نهاية JSONP على البيانات غير الحساسة والقراءة فقط، حيث يمكن لأي صفحة على الويب تحميل نقطة نهاية JSONP الخاصة بك عبر علامة `<script>`.
:::

## انظر أيضاً

- [عرض XML/JSON/YAML/ProtoBuf](/ar/docs/rendering/rendering/)
- [SecureJSON](/ar/docs/rendering/secure-json/)
- [AsciiJSON](/ar/docs/rendering/ascii-json/)
- [PureJSON](/ar/docs/rendering/pure-json/)
