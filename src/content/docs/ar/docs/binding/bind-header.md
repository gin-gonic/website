---
title: "ربط الترويسة"
sidebar:
  order: 9
---

`ShouldBindHeader` يربط ترويسات طلب HTTP مباشرة في هيكل باستخدام علامات الهيكل `header`. هذا مفيد لاستخراج البيانات الوصفية مثل حدود معدل API أو رموز المصادقة أو ترويسات النطاق المخصصة من الطلبات الواردة.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

type testHeader struct {
  Rate   int    `header:"Rate"`
  Domain string `header:"Domain"`
}

func main() {
  r := gin.Default()

  r.GET("/", func(c *gin.Context) {
    h := testHeader{}

    if err := c.ShouldBindHeader(&h); err != nil {
      c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      return
    }

    c.JSON(http.StatusOK, gin.H{"Rate": h.Rate, "Domain": h.Domain})
  })

  r.Run(":8080")
}
```

## اختبره

```sh
# Pass custom headers
curl -H "Rate:300" -H "Domain:music" http://localhost:8080/
# Output: {"Domain":"music","Rate":300}

# Missing headers -- zero values are used
curl http://localhost:8080/
# Output: {"Domain":"","Rate":0}
```

:::note
أسماء الترويسات غير حساسة لحالة الأحرف وفقاً لمواصفات HTTP. قيمة علامة الهيكل `header` تتم مطابقتها دون حساسية لحالة الأحرف، لذا `header:"Rate"` ستطابق الترويسات المرسلة كـ `Rate` أو `rate` أو `RATE`.
:::

:::tip
يمكنك دمج علامات `header` مع `binding:"required"` لرفض الطلبات التي تفتقر إلى الترويسات المطلوبة:

```go
type authHeader struct {
  Token string `header:"Authorization" binding:"required"`
}
```

:::

## انظر أيضاً

- [الربط والتحقق](/ar/docs/binding/binding-and-validation/)
- [ربط سلسلة الاستعلام أو بيانات الإرسال](/ar/docs/binding/bind-query-or-post/)
