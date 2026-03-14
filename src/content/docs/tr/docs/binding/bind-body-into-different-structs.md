---
title: "Gövdeyi farklı struct'lara bağlamayı deneme"
sidebar:
  order: 13
---

İstek gövdesini bağlamak için kullanılan normal metodlar `c.Request.Body`'yi tüketir ve birden fazla kez çağrılamazlar.

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

Bunun için `c.ShouldBindBodyWith` kullanabilirsiniz.

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

* `c.ShouldBindBodyWith` bağlamadan önce gövdeyi context'e kaydeder. Bu, performansı biraz etkiler, bu nedenle yalnızca bir kez bağlamanız gerekiyorsa bu metodu kullanmamalısınız.
* Bu özellik yalnızca bazı formatlar için gereklidir -- `JSON`, `XML`, `MsgPack`, `ProtoBuf`. Diğer formatlar için `Query`, `Form`, `FormPost`, `FormMultipart`, performansa herhangi bir zarar vermeden `c.ShouldBind()` ile birden fazla kez çağrılabilir (Bakınız [#1341](https://github.com/gin-gonic/gin/pull/1341)).

