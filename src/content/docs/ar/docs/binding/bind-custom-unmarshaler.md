---
title: "ربط محلل مخصص"
sidebar:
  order: 8
---

لتجاوز منطق الربط الافتراضي في Gin، حدد دالة على نوعك تُحقق واجهة `encoding.TextUnmarshaler` من مكتبة Go القياسية. ثم حدد `parser=encoding.TextUnmarshaler` في علامة `uri`/`form` للحقل المُراد ربطه.

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

اختبرها باستخدام:

```sh
curl 'localhost:8088/test?birthday=2000-01-01&birthdays=2000-01-01,2000-01-02'
```

النتيجة:

```sh
{"Birthday":"2000/01/01","Birthdays":["2000/01/01","2000/01/02"],"BirthdaysDefault":["2020/09/01","2020/09/02"]}
```

> **ملاحظة:** إذا تم تحديد `parser=encoding.TextUnmarshaler` لنوع **لا** يُنفذ `encoding.TextUnmarshaler`، سيتجاهله Gin ويتابع بمنطق الربط الافتراضي.

### استخدام BindUnmarshaler

إذا كان النوع ينفذ `encoding.TextUnmarshaler` بالفعل لكنك تريد تخصيص كيفية ربط Gin للنوع بشكل مختلف (مثلاً لتغيير رسالة الخطأ المُرجعة)، يمكنك تنفيذ واجهة `BindUnmarshaler` المخصصة بدلاً من ذلك.

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

> **ملاحظة:** إذا كان النوع ينفذ كلاً من `encoding.TextUnmarshaler` و`BindUnmarshaler`، سيستخدم Gin `BindUnmarshaler` افتراضياً ما لم تحدد `parser=encoding.TextUnmarshaler` في علامة الربط.
