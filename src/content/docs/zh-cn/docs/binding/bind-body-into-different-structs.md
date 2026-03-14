---
title: "将请求体绑定到不同的结构体"
sidebar:
  order: 13
---

普通的请求体绑定方法会消费 `c.Request.Body`，因此不能被多次调用。

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

为此，你可以使用 `c.ShouldBindBodyWith`。

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

* `c.ShouldBindBodyWith` 在绑定之前会将请求体存储到上下文中。这对性能有轻微影响，因此如果你只需要绑定一次，不应该使用此方法。
* 此功能仅适用于某些格式——`JSON`、`XML`、`MsgPack`、`ProtoBuf`。对于其他格式，`Query`、`Form`、`FormPost`、`FormMultipart` 可以通过 `c.ShouldBind()` 多次调用而不会影响性能（参见 [#1341](https://github.com/gin-gonic/gin/pull/1341)）。
