---
title: "Пользовательский unmarshaler для привязки"
sidebar:
  order: 8
---

Чтобы переопределить стандартную логику привязки Gin, определите функцию на вашем типе, которая реализует интерфейс `encoding.TextUnmarshaler` из стандартной библиотеки Go. Затем укажите `parser=encoding.TextUnmarshaler` в теге `uri`/`form` привязываемого поля.

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

Проверьте с помощью:

```sh
curl 'localhost:8088/test?birthday=2000-01-01&birthdays=2000-01-01,2000-01-02'
```

Результат:

```sh
{"Birthday":"2000/01/01","Birthdays":["2000/01/01","2000/01/02"],"BirthdaysDefault":["2020/09/01","2020/09/02"]}
```

> **Примечание:** Если `parser=encoding.TextUnmarshaler` указан для типа, который **не** реализует `encoding.TextUnmarshaler`, Gin проигнорирует его и продолжит со стандартной логикой привязки.

### Использование BindUnmarshaler

Если тип уже реализует `encoding.TextUnmarshaler`, но вы хотите настроить привязку Gin по-другому (например, изменить сообщение об ошибке), вы можете реализовать специальный интерфейс `BindUnmarshaler`.

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

> **Примечание:** Если тип реализует оба интерфейса — `encoding.TextUnmarshaler` и `BindUnmarshaler`, Gin по умолчанию будет использовать `BindUnmarshaler`, если вы не укажете `parser=encoding.TextUnmarshaler` в теге привязки.
