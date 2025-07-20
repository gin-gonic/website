---
title: "將請求內文綁定到不同的結構中"
---

綁定請求內文的常規方法會消耗 `c.Request.Body`，且無法多次呼叫。

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
  // 這個 c.ShouldBind 會消耗 c.Request.Body，因此無法重複使用。
  if errA := c.ShouldBind(&objA); errA == nil {
    c.String(http.StatusOK, `請求內文應為 formA`)
  // 這裡總會發生錯誤，因為 c.Request.Body 現在是 EOF。
  } else if errB := c.ShouldBind(&objB); errB == nil {
    c.String(http.StatusOK, `請求內文應為 formB`)
  } else {
    ...
  }
}
```

為此，您可以使用 `c.ShouldBindBodyWith`。

```go
func SomeHandler(c *gin.Context) {
  objA := formA{}
  objB := formB{}
  // 這會讀取 c.Request.Body 並將結果儲存到上下文中。
  if errA := c.ShouldBindBodyWith(&objA, binding.JSON); errA == nil {
    c.String(http.StatusOK, `請求內文應為 formA`)
  // 此時，它會重複使用儲存在上下文中的內文。
  } else if errB := c.ShouldBindBodyWith(&objB, binding.JSON); errB == nil {
    c.String(http.StatusOK, `請求內文應為 formB 的 JSON`)
  // 並且它可以接受其他格式
  } else if errB2 := c.ShouldBindBodyWith(&objB, binding.XML); errB2 == nil {
    c.String(http.StatusOK, `請求內文應為 formB 的 XML`)
  } else {
    ...
  }
}
```

* `c.ShouldBindBodyWith` 會在綁定前將內文儲存到上下文中。這對效能有輕微影響，因此如果您只需呼叫一次綁定，則不應使用此方法。
* 此功能僅適用於某些格式——`JSON`、`XML`、`MsgPack`、`ProtoBuf`。對於其他格式，如 `Query`、`Form`、`FormPost`、`FormMultipart`，可以多次呼叫 `c.ShouldBind()` 而不會對效能造成任何損害（請參閱 [#1341](https://github.com/gin-gonic/gin/pull/1341)）。
