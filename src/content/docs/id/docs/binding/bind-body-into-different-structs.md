---
title: "Mencoba bind body ke struct berbeda"
sidebar:
  order: 13
---

Metode normal untuk binding body permintaan mengonsumsi `c.Request.Body` dan tidak dapat dipanggil berkali-kali.

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

Untuk ini, Anda dapat menggunakan `c.ShouldBindBodyWith`.

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

* `c.ShouldBindBodyWith` menyimpan body ke dalam context sebelum binding. Ini memiliki sedikit dampak pada performa, jadi Anda tidak perlu menggunakan metode ini jika Anda hanya perlu melakukan binding sekali.
* Fitur ini hanya diperlukan untuk beberapa format -- `JSON`, `XML`, `MsgPack`, `ProtoBuf`. Untuk format lain, `Query`, `Form`, `FormPost`, `FormMultipart`, dapat dipanggil oleh `c.ShouldBind()` berkali-kali tanpa dampak pada performa (Lihat [#1341](https://github.com/gin-gonic/gin/pull/1341)).
