---
title: "القيم الافتراضية لحقول النماذج"
sidebar:
  order: 5
---

أحياناً تريد أن يعود حقل إلى قيمة افتراضية عندما لا يرسل العميل قيمة. يدعم ربط النماذج في Gin القيم الافتراضية عبر خيار `default` في علامة هيكل `form`. يعمل هذا مع القيم المفردة، ومنذ الإصدار Gin v1.11، مع المجموعات (الشرائح/المصفوفات) بتنسيقات مجموعات صريحة.

النقاط الرئيسية:

- ضع القيمة الافتراضية مباشرة بعد مفتاح النموذج: `form:"name,default=William"`.
- للمجموعات، حدد كيفية تقسيم القيم باستخدام `collection_format:"multi|csv|ssv|tsv|pipes"`.
- لتنسيقي `multi` و`csv`، استخدم الفواصل المنقوطة في القيمة الافتراضية لفصل القيم (مثل `default=1;2;3`). يحوّلها Gin إلى فواصل داخلياً ليبقى محلل العلامات واضحاً.
- لتنسيقات `ssv` (مسافة) و`tsv` (تبويب) و`pipes` (أنبوب)، استخدم الفاصل الطبيعي في القيمة الافتراضية.

مثال:

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

type Person struct {
  Name      string    `form:"name,default=William"`
  Age       int       `form:"age,default=10"`
  Friends   []string  `form:"friends,default=Will;Bill"`                     // multi/csv: use ; in defaults
  Addresses [2]string `form:"addresses,default=foo bar" collection_format:"ssv"`
  LapTimes  []int     `form:"lap_times,default=1;2;3" collection_format:"csv"`
}

func main() {
  r := gin.Default()
  r.POST("/person", func(c *gin.Context) {
    var req Person
    if err := c.ShouldBind(&req); err != nil { // infers binder by Content-Type
      c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      return
    }
    c.JSON(http.StatusOK, req)
  })
  _ = r.Run(":8080")
}
```

إذا أرسلت POST بدون أي جسم، يستجيب Gin بالقيم الافتراضية:

```sh
curl -X POST http://localhost:8080/person
```

الاستجابة (مثال):

```json
{
  "Name": "William",
  "Age": 10,
  "Friends": ["Will", "Bill"],
  "Addresses": ["foo", "bar"],
  "LapTimes": [1, 2, 3]
}
```

ملاحظات وتحذيرات:

- تُستخدم الفواصل في صياغة علامات هياكل Go لفصل الخيارات؛ تجنب الفواصل داخل القيم الافتراضية.
- لتنسيقي `multi` و`csv`، تفصل الفواصل المنقوطة القيم الافتراضية؛ لا تضمّن فواصل منقوطة داخل القيم الافتراضية الفردية لهذه التنسيقات.
- ستؤدي قيم `collection_format` غير الصالحة إلى خطأ في الربط.

التغييرات ذات الصلة:

- تم تحسين تنسيقات المجموعات لربط النماذج (`multi`، `csv`، `ssv`، `tsv`، `pipes`) حوالي الإصدار v1.11.
- تمت إضافة القيم الافتراضية للمجموعات في الإصدار v1.11 (PR #4048).
