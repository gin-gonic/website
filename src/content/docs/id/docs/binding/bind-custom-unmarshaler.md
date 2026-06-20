---
title: "Bind unmarshaler kustom"
sidebar:
  order: 8
---

Untuk mengganti logika binding default Gin, definisikan fungsi pada tipe Anda yang memenuhi antarmuka `encoding.TextUnmarshaler` dari pustaka standar Go. Kemudian tentukan `parser=encoding.TextUnmarshaler` dalam tag `uri`/`form` dari field yang diikat.

```go
package main

import (
  "encoding"
  "strings"

  "github.com/gin-gonic/gin"
)

type Birthday string

func (b *Birthday) UnmarshalText(text []byte) error {
  *b = Birthday(strings.Replace(string(text), "-", "/", -1))
  return nil
}

var _ encoding.TextUnmarshaler = (*Birthday)(nil)

func main() {
  route := gin.Default()
  var request struct {
    Birthday         Birthday   `form:"birthday,parser=encoding.TextUnmarshaler"`
    Birthdays        []Birthday `form:"birthdays,parser=encoding.TextUnmarshaler" collection_format:"csv"`
    BirthdaysDefault []Birthday `form:"birthdaysDef,default=2020-09-01;2020-09-02,parser=encoding.TextUnmarshaler" collection_format:"csv"`
  }
  route.GET("/test", func(ctx *gin.Context) {
    _ = ctx.BindQuery(&request)
    ctx.JSON(200, request)
  })
  _ = route.Run(":8088")
}
```

Uji dengan:

```sh
curl 'localhost:8088/test?birthday=2000-01-01&birthdays=2000-01-01,2000-01-02'
```

Hasil:

```sh
{"Birthday":"2000/01/01","Birthdays":["2000/01/01","2000/01/02"],"BirthdaysDefault":["2020/09/01","2020/09/02"]}
```

> **Catatan:** Jika `parser=encoding.TextUnmarshaler` ditentukan untuk tipe yang **tidak** mengimplementasikan `encoding.TextUnmarshaler`, Gin akan mengabaikannya dan melanjutkan dengan logika binding default-nya.

### Menggunakan BindUnmarshaler

Jika sebuah tipe sudah mengimplementasikan `encoding.TextUnmarshaler` tetapi Anda ingin menyesuaikan cara Gin mengikat tipe tersebut secara berbeda (mis., untuk mengubah pesan error yang dikembalikan), Anda dapat mengimplementasikan antarmuka `BindUnmarshaler` yang khusus.

```go
package main

import (
  "strings"

  "github.com/gin-gonic/gin"
  "github.com/gin-gonic/gin/binding"
)

type Birthday string

func (b *Birthday) UnmarshalParam(param string) error {
  *b = Birthday(strings.Replace(param, "-", "/", -1))
  return nil
}

var _ binding.BindUnmarshaler = (*Birthday)(nil)

func main() {
  route := gin.Default()
  var request struct {
    Birthday         Birthday   `form:"birthday"`
    Birthdays        []Birthday `form:"birthdays" collection_format:"csv"`
    BirthdaysDefault []Birthday `form:"birthdaysDef,default=2020-09-01;2020-09-02" collection_format:"csv"`
  }
  route.GET("/test", func(ctx *gin.Context) {
    _ = ctx.BindQuery(&request)
    ctx.JSON(200, request)
  })
  _ = route.Run(":8088")
}
```

> **Catatan:** Jika sebuah tipe mengimplementasikan baik `encoding.TextUnmarshaler` maupun `BindUnmarshaler`, Gin akan menggunakan `BindUnmarshaler` secara default kecuali Anda menentukan `parser=encoding.TextUnmarshaler` dalam tag binding.
