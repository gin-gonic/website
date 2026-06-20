---
title: "AsciiJSON"
sidebar:
  order: 4
---

يُسلسل `AsciiJSON` البيانات إلى JSON لكن يُرمّز جميع الأحرف غير ASCII إلى تسلسلات ترميز Unicode بصيغة `\uXXXX`. الأحرف الخاصة بـ HTML مثل `<` و`>` تُرمّز أيضاً. والنتيجة هي جسم استجابة يحتوي فقط على أحرف ASCII ذات 7 بت.

**متى تستخدم AsciiJSON:**

- عندما يتطلب مستهلكو واجهتك البرمجية استجابات آمنة بصرامة كـ ASCII (مثلاً الأنظمة التي لا تستطيع التعامل مع بايتات مرمّزة بـ UTF-8).
- عندما تحتاج لتضمين JSON داخل سياقات تدعم ASCII فقط، مثل بعض أنظمة التسجيل أو وسائل النقل القديمة.
- عندما تريد التأكد من ترميز أحرف مثل `<` و`>` و`&` لتجنب مشاكل الحقن عند تضمين JSON في HTML.

بالنسبة لمعظم الواجهات البرمجية الحديثة، يكفي استخدام `c.JSON()` القياسي لأنه يُخرج UTF-8 صالحاً. استخدم `AsciiJSON` فقط عندما يكون أمان ASCII متطلباً محدداً.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.GET("/someJSON", func(c *gin.Context) {
    data := map[string]interface{}{
      "lang": "GO语言",
      "tag":  "<br>",
    }

    // will output : {"lang":"GO\u8bed\u8a00","tag":"\u003cbr\u003e"}
    c.AsciiJSON(http.StatusOK, data)
  })

  // Listen and serve on 0.0.0.0:8080
  router.Run(":8080")
}
```

يمكنك اختبار نقطة النهاية هذه باستخدام curl:

```bash
curl http://localhost:8080/someJSON
# Output: {"lang":"GO\u8bed\u8a00","tag":"\u003cbr\u003e"}
```

لاحظ أن الأحرف الصينية `语言` تم استبدالها بـ `\u8bed\u8a00`، وعلامة `<br>` أصبحت `\u003cbr\u003e`. جسم الاستجابة آمن للاستهلاك في أي بيئة تدعم ASCII فقط.
