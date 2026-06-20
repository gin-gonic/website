---
title: "محاولة ربط الجسم في هياكل مختلفة"
sidebar:
  order: 13
---

طرق الربط القياسية مثل `c.ShouldBind` تستهلك `c.Request.Body`، وهو `io.ReadCloser` — بمجرد قراءته، لا يمكن قراءته مرة أخرى. هذا يعني أنه لا يمكنك استدعاء `c.ShouldBind` عدة مرات على نفس الطلب لتجربة أشكال هياكل مختلفة.

لحل هذه المشكلة، استخدم `c.ShouldBindBodyWith`. يقرأ الجسم مرة واحدة ويخزّنه في السياق، مما يسمح لعمليات الربط اللاحقة بإعادة استخدام الجسم المخزّن مؤقتاً.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
  "github.com/gin-gonic/gin/binding"
)

type formA struct {
  Foo string `json:"foo" xml:"foo" binding:"required"`
}

type formB struct {
  Bar string `json:"bar" xml:"bar" binding:"required"`
}

func main() {
  router := gin.Default()

  router.POST("/bind", func(c *gin.Context) {
    objA := formA{}
    objB := formB{}
    // This reads c.Request.Body and stores the result into the context.
    if errA := c.ShouldBindBodyWith(&objA, binding.JSON); errA == nil {
      c.JSON(http.StatusOK, gin.H{"message": "matched formA", "foo": objA.Foo})
      return
    }
    // At this time, it reuses body stored in the context.
    if errB := c.ShouldBindBodyWith(&objB, binding.JSON); errB == nil {
      c.JSON(http.StatusOK, gin.H{"message": "matched formB", "bar": objB.Bar})
      return
    }

    c.JSON(http.StatusBadRequest, gin.H{"error": "request body did not match any known format"})
  })

  router.Run(":8080")
}
```

## اختبره

```sh
# Body matches formA
curl -X POST http://localhost:8080/bind \
  -H "Content-Type: application/json" \
  -d '{"foo":"hello"}'
# Output: {"foo":"hello","message":"matched formA"}

# Body matches formB
curl -X POST http://localhost:8080/bind \
  -H "Content-Type: application/json" \
  -d '{"bar":"world"}'
# Output: {"bar":"world","message":"matched formB"}
```

:::note
`c.ShouldBindBodyWith` يخزّن الجسم في السياق قبل الربط. هذا له تأثير طفيف على الأداء، لذا استخدمه فقط عندما تحتاج لربط الجسم أكثر من مرة. بالنسبة للتنسيقات التي لا تقرأ الجسم — مثل `Query`، `Form`، `FormPost`، `FormMultipart` — يمكنك استدعاء `c.ShouldBind()` عدة مرات دون مشكلة.
:::

## انظر أيضاً

- [الربط والتحقق](/ar/docs/binding/binding-and-validation/)
- [ربط سلسلة الاستعلام أو بيانات الإرسال](/ar/docs/binding/bind-query-or-post/)
