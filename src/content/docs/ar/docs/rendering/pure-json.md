---
title: "PureJSON"
sidebar:
  order: 5
---

عادةً، يستبدل `json.Marshal` في Go أحرف HTML الخاصة بتسلسلات هروب Unicode للأمان — على سبيل المثال، `<` تصبح `\u003c`. هذا مناسب عند تضمين JSON في HTML، لكن إذا كنت تبني واجهة برمجة تطبيقات بحتة، قد يتوقع العملاء الأحرف الحرفية.

`c.PureJSON` يستخدم `json.Encoder` مع `SetEscapeHTML(false)`، بحيث تُعرض أحرف HTML مثل `<` و`>` و`&` حرفياً بدلاً من تحويلها.

استخدم `PureJSON` عندما يتوقع مستهلكو API الخام بيانات JSON غير محوّلة. استخدم `JSON` القياسي عندما قد تُضمّن الاستجابة في صفحة HTML.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  // Standard JSON -- escapes HTML characters
  router.GET("/json", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{
      "html": "<b>Hello, world!</b>",
    })
  })

  // PureJSON -- serves literal characters
  router.GET("/purejson", func(c *gin.Context) {
    c.PureJSON(http.StatusOK, gin.H{
      "html": "<b>Hello, world!</b>",
    })
  })

  router.Run(":8080")
}
```

## اختبره

```sh
# Standard JSON -- HTML characters are escaped
curl http://localhost:8080/json
# Output: {"html":"\u003cb\u003eHello, world!\u003c/b\u003e"}

# PureJSON -- HTML characters are literal
curl http://localhost:8080/purejson
# Output: {"html":"<b>Hello, world!</b>"}
```

:::tip
يوفر Gin أيضاً `c.AbortWithStatusPureJSON` (الإصدار 1.11+) لإرجاع JSON غير محوّل مع إيقاف سلسلة الوسيط — مفيد في وسيط المصادقة أو التحقق.
:::

## انظر أيضاً

- [AsciiJSON](/ar/docs/rendering/ascii-json/)
- [SecureJSON](/ar/docs/rendering/secure-json/)
- [العرض](/ar/docs/rendering/rendering/)
