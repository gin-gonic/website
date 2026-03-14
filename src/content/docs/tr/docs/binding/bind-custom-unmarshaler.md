---
title: "Özel unmarshaler bağlama"
sidebar:
  order: 8
---

Gin'in varsayılan bağlama mantığını geçersiz kılmak için, türünüzde Go standart kütüphanesinden `encoding.TextUnmarshaler` arayüzünü karşılayan bir fonksiyon tanımlayın. Ardından bağlanan alanın `uri`/`form` etiketinde `parser=encoding.TextUnmarshaler` belirtin.

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

Şununla test edin:

```sh
curl 'localhost:8088/test?birthday=2000-01-01&birthdays=2000-01-01,2000-01-02'
```

Sonuç:

```sh
{"Birthday":"2000/01/01","Birthdays":["2000/01/01","2000/01/02"],"BirthdaysDefault":["2020/09/01","2020/09/02"]}
```

> **Not:** `parser=encoding.TextUnmarshaler`, `encoding.TextUnmarshaler` uygulamayan bir tür için belirtilmişse, Gin bunu yok sayar ve varsayılan bağlama mantığıyla devam eder.

### BindUnmarshaler kullanımı

Bir tür zaten `encoding.TextUnmarshaler` uygulıyorsa ancak Gin'in türü nasıl bağladığını farklı şekilde özelleştirmek istiyorsanız (ör., döndürülen hata mesajını değiştirmek için), bunun yerine özel `BindUnmarshaler` arayüzünü uygulayabilirsiniz.

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

> **Not:** Bir tür hem `encoding.TextUnmarshaler` hem de `BindUnmarshaler` uygulıyorsa, bağlama etiketinde `parser=encoding.TextUnmarshaler` belirtmediğiniz sürece Gin varsayılan olarak `BindUnmarshaler` kullanacaktır.
