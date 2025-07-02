---
title: "Bind body ke struct yang berbeda"
---

Metode normal untuk binding body permintaan akan menggunakan `c.Request.Body` dan tidak dapat dipanggil berkali-kali.

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
  // c.ShouldBind ini menggunakan c.Request.Body dan tidak dapat digunakan kembali.
  if errA := c.ShouldBind(&objA); errA == nil {
    c.String(http.StatusOK, `the body should be formA`)
  // Ini akan selalu menghasilkan error karena c.Request.Body sekarang sudah EOF.
  } else if errB := c.ShouldBind(&objB); errB == nil {
    c.String(http.StatusOK, `the body should be formB`)
  } else {
    ...
  }
}
```

Untuk kasus ini, Anda dapat menggunakan `c.ShouldBindBodyWith`.

```go
func SomeHandler(c *gin.Context) {
  objA := formA{}
  objB := formB{}
  // Membaca c.Request.Body dan menyimpan hasilnya ke dalam context.
  if errA := c.ShouldBindBodyWith(&objA, binding.JSON); errA == nil {
    c.String(http.StatusOK, `the body should be formA`)
  // Menggunakan kembali body yang tersimpan di dalam context.
  } else if errB := c.ShouldBindBodyWith(&objB, binding.JSON); errB == nil {
    c.String(http.StatusOK, `the body should be formB JSON`)
  // Dapat menerima format lain juga
  } else if errB2 := c.ShouldBindBodyWith(&objB, binding.XML); errB2 == nil {
    c.String(http.StatusOK, `the body should be formB XML`)
  } else {
    ...
  }
}
```

* `c.ShouldBindBodyWith` menyimpan body ke dalam context sebelum melakukan binding.
Ini sedikit berdampak pada performa, jadi Anda sebaiknya tidak menggunakan metode ini jika
Anda hanya memanggil binding sekali saja.
* Fitur ini hanya untuk beberapa format -- `JSON`, `XML`, `MsgPack`,
`ProtoBuf`. Untuk format lain, `Query`, `Form`, `FormPost`, `FormMultipart`,
dapat dipanggil dengan `c.ShouldBind()` berkali-kali tanpa mengganggu performa (lihat [#1341](https://github.com/gin-gonic/gin/pull/1341)).

