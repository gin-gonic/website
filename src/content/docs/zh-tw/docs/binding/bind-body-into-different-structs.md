---
title: "嘗試將請求主體綁定到不同結構體"
sidebar:
  order: 13
---

綁定請求主體的一般方法會消耗 `c.Request.Body`，因此無法多次呼叫。

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

要解決這個問題，你可以使用 `c.ShouldBindBodyWith`。

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

* `c.ShouldBindBodyWith` 會在綁定之前將主體儲存到上下文中。這對效能有輕微影響，因此如果只需要綁定一次，不應使用此方法。
* 此功能僅在某些格式中需要—— `JSON`、`XML`、`MsgPack`、`ProtoBuf`。對於其他格式，`Query`、`Form`、`FormPost`、`FormMultipart` 可以透過 `c.ShouldBind()` 多次呼叫而不會影響效能（參見 [#1341](https://github.com/gin-gonic/gin/pull/1341)）。
