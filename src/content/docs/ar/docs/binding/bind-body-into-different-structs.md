---
title: "محاولة ربط الجسم في هياكل مختلفة"
sidebar:
  order: 13
---

الطرق العادية لربط جسم الطلب تستهلك `c.Request.Body` ولا يمكن
استدعاؤها عدة مرات.

```go
type formA struct {
  Foo string `json:"foo" xml:"foo" binding:"required"`
}

type formB struct {
  Bar string `json:"bar" xml:"bar" binding:"required"`
}

func SomeHandler(c *gin.Context) {
  objA := formA{}
  objB := formB{}
  // This c.ShouldBind consumes c.Request.Body and it cannot be reused.
  if errA := c.ShouldBind(&objA); errA == nil {
    c.String(http.StatusOK, `the body should be formA`)
  // Always an error is occurred by this because c.Request.Body is EOF now.
  } else if errB := c.ShouldBind(&objB); errB == nil {
    c.String(http.StatusOK, `the body should be formB`)
  } else {
    ...
  }
}
```

لهذا الغرض، يمكنك استخدام `c.ShouldBindBodyWith`.

```go
func SomeHandler(c *gin.Context) {
  objA := formA{}
  objB := formB{}
  // This reads c.Request.Body and stores the result into the context.
  if errA := c.ShouldBindBodyWith(&objA, binding.JSON); errA == nil {
    c.String(http.StatusOK, `the body should be formA`)
  // At this time, it reuses body stored in the context.
  } else if errB := c.ShouldBindBodyWith(&objB, binding.JSON); errB == nil {
    c.String(http.StatusOK, `the body should be formB JSON`)
  // And it can accepts other formats
  } else if errB2 := c.ShouldBindBodyWith(&objB, binding.XML); errB2 == nil {
    c.String(http.StatusOK, `the body should be formB XML`)
  } else {
    ...
  }
}
```

* `c.ShouldBindBodyWith` يخزّن الجسم في السياق قبل الربط. هذا له
تأثير طفيف على الأداء، لذا لا ينبغي استخدام هذه الطريقة إذا كنت تحتاج فقط للربط مرة واحدة.
* هذه الميزة مطلوبة فقط لبعض التنسيقات -- `JSON`، `XML`، `MsgPack`،
`ProtoBuf`. بالنسبة للتنسيقات الأخرى، `Query`، `Form`، `FormPost`، `FormMultipart`،
يمكن استدعاؤها بواسطة `c.ShouldBind()` عدة مرات دون أي تأثير على
الأداء (راجع [#1341](https://github.com/gin-gonic/gin/pull/1341)).
