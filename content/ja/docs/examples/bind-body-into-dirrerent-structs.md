---
title: "body を異なる構造体にバインドするには"
draft: false
---

通常のリクエスト本文をバインドするメソッドたちは、`c.Request.Body` を消費します。よってそれらのメソッドは複数回呼び出すことができません。

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
  // この c.ShouldBind メソッドは c.Request.Body を消費し、再利用できなくします。
  if errA := c.ShouldBind(&objA); errA == nil {
    c.String(http.StatusOK, `the body should be formA`)
  // c.Request.Body が EOF なので、常にエラーとなります。
  } else if errB := c.ShouldBind(&objB); errB == nil {
    c.String(http.StatusOK, `the body should be formB`)
  } else {
    ...
  }
}
```

複数回呼び出したい場合、`c.ShouldBindBodyWith` を使ってください。

```go
func SomeHandler(c *gin.Context) {
  objA := formA{}
  objB := formB{}
  // このコードは、c.Request.Body を読み込み、そして結果を context に保存します。
  if errA := c.ShouldBindBodyWith(&objA, binding.JSON); errA == nil {
    c.String(http.StatusOK, `the body should be formA`)
  // ここでは、context に保存された body を再利用します。
  } else if errB := c.ShouldBindBodyWith(&objB, binding.JSON); errB == nil {
    c.String(http.StatusOK, `the body should be formB JSON`)
  // 他のフォーマットも受け付けます。
  } else if errB2 := c.ShouldBindBodyWith(&objB, binding.XML); errB2 == nil {
    c.String(http.StatusOK, `the body should be formB XML`)
  } else {
    ...
  }
}
```

* `c.ShouldBindBodyWith` はバインド前に context にリクエスト本文を保存します。この処理は、パフォーマンスにわずかな影響を与えます。バインディングが一度だけで良いなら、このメソッドは使うべきではありません。
* この機能は `JSON`, `XML`, `MsgPack`,`ProtoBuf` のフォーマットでのみ必要です。`Query`, `Form`, `FormPost`, `FormMultipart` のような他のフォーマットでは `c.ShouldBind()` を何度も呼び出せるので、パフォーマンスへの影響はありません。(Issue [#1341](https://github.com/gin-gonic/gin/pull/1341) も参照ください)
