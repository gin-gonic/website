---
title: "Unmarshaler سفارشی برای اتصال"
sidebar:
  order: 8
---

برای بازنویسی منطق اتصال پیش‌فرض Gin، یک تابع روی نوع خود تعریف کنید که رابط `encoding.TextUnmarshaler` از کتابخانه استاندارد Go را برآورده کند. سپس `parser=encoding.TextUnmarshaler` را در تگ `uri`/`form` فیلدی که متصل می‌شود مشخص کنید.

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

با دستور زیر تست کنید:

```sh
curl 'localhost:8088/test?birthday=2000-01-01&birthdays=2000-01-01,2000-01-02'
```

نتیجه:

```sh
{"Birthday":"2000/01/01","Birthdays":["2000/01/01","2000/01/02"],"BirthdaysDefault":["2020/09/01","2020/09/02"]}
```

> **توجه:** اگر `parser=encoding.TextUnmarshaler` برای نوعی مشخص شود که رابط `encoding.TextUnmarshaler` را پیاده‌سازی **نکرده** باشد، Gin آن را نادیده گرفته و با منطق اتصال پیش‌فرض خود ادامه می‌دهد.

### استفاده از BindUnmarshaler

اگر یک نوع قبلاً `encoding.TextUnmarshaler` را پیاده‌سازی کرده اما می‌خواهید نحوه اتصال Gin به آن نوع را متفاوت سفارشی کنید (مثلاً تغییر پیام خطای برگردانده شده)، می‌توانید به جای آن رابط اختصاصی `BindUnmarshaler` را پیاده‌سازی کنید.

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

> **توجه:** اگر یک نوع هم `encoding.TextUnmarshaler` و هم `BindUnmarshaler` را پیاده‌سازی کرده باشد، Gin به طور پیش‌فرض از `BindUnmarshaler` استفاده می‌کند مگر اینکه `parser=encoding.TextUnmarshaler` را در تگ اتصال مشخص کنید.
