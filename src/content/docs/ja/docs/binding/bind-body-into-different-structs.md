---
title: "ボディを異なる構造体にバインドする"
sidebar:
  order: 13
---

リクエストボディをバインドする通常のメソッドは`c.Request.Body`を消費するため、
複数回呼び出すことはできません。

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
  // このc.ShouldBindはc.Request.Bodyを消費するため、再利用できません。
  if errA := c.ShouldBind(&objA); errA == nil {
    c.String(http.StatusOK, `the body should be formA`)
  // c.Request.BodyはEOFになっているため、常にエラーが発生します。
  } else if errB := c.ShouldBind(&objB); errB == nil {
    c.String(http.StatusOK, `the body should be formB`)
  } else {
    ...
  }
}
```

この場合、`c.ShouldBindBodyWith`を使用できます。

```go
func SomeHandler(c *gin.Context) {
  objA := formA{}
  objB := formB{}
  // これはc.Request.Bodyを読み取り、結果をコンテキストに格納します。
  if errA := c.ShouldBindBodyWith(&objA, binding.JSON); errA == nil {
    c.String(http.StatusOK, `the body should be formA`)
  // この時点では、コンテキストに格納されたボディを再利用します。
  } else if errB := c.ShouldBindBodyWith(&objB, binding.JSON); errB == nil {
    c.String(http.StatusOK, `the body should be formB JSON`)
  // また、他のフォーマットも受け入れられます
  } else if errB2 := c.ShouldBindBodyWith(&objB, binding.XML); errB2 == nil {
    c.String(http.StatusOK, `the body should be formB XML`)
  } else {
    ...
  }
}
```

* `c.ShouldBindBodyWith`はバインド前にボディをコンテキストに格納します。これは
パフォーマンスにわずかな影響があるため、一度だけバインドする場合はこのメソッドを使用すべきではありません。
* この機能は一部のフォーマット -- `JSON`、`XML`、`MsgPack`、
`ProtoBuf`でのみ必要です。他のフォーマット、`Query`、`Form`、`FormPost`、`FormMultipart`は
`c.ShouldBind()`で複数回呼び出してもパフォーマンスに影響はありません
（[#1341](https://github.com/gin-gonic/gin/pull/1341)を参照）。
