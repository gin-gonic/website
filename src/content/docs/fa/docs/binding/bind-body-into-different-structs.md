---
title: "تلاش برای اتصال بدنه به structهای مختلف"
sidebar:
  order: 13
---

متدهای معمول برای اتصال بدنه درخواست `c.Request.Body` را مصرف می‌کنند و نمی‌توانند چندین بار فراخوانی شوند.

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

برای این کار، می‌توانید از `c.ShouldBindBodyWith` استفاده کنید.

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

* `c.ShouldBindBodyWith` قبل از اتصال، بدنه را در context ذخیره می‌کند. این تأثیر جزئی بر عملکرد دارد، بنابراین اگر فقط نیاز به یک بار اتصال دارید نباید از این متد استفاده کنید.
* این ویژگی فقط برای برخی فرمت‌ها نیاز است -- `JSON`، `XML`، `MsgPack`، `ProtoBuf`. برای فرمت‌های دیگر، `Query`، `Form`، `FormPost`، `FormMultipart`، می‌توانند چندین بار با `c.ShouldBind()` بدون آسیب به عملکرد فراخوانی شوند (ببینید [#1341](https://github.com/gin-gonic/gin/pull/1341)).

