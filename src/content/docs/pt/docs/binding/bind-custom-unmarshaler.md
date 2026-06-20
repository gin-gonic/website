---
title: "Bind com unmarshaler customizado"
sidebar:
  order: 8
---

Para substituir a lógica de binding padrão do Gin, defina uma função no seu tipo que satisfaça a interface `encoding.TextUnmarshaler` da biblioteca padrão do Go. Em seguida, especifique `parser=encoding.TextUnmarshaler` na tag `uri`/`form` do campo sendo vinculado.

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

Teste com:

```sh
curl 'localhost:8088/test?birthday=2000-01-01&birthdays=2000-01-01,2000-01-02'
```

Resultado:

```sh
{"Birthday":"2000/01/01","Birthdays":["2000/01/01","2000/01/02"],"BirthdaysDefault":["2020/09/01","2020/09/02"]}
```

> **Nota:** Se `parser=encoding.TextUnmarshaler` for especificado para um tipo que **não** implementa `encoding.TextUnmarshaler`, o Gin irá ignorá-lo e prosseguir com sua lógica de binding padrão.

### Usando BindUnmarshaler

Se um tipo já implementa `encoding.TextUnmarshaler` mas você quer personalizar como o Gin vincula o tipo de forma diferente (por exemplo, para alterar a mensagem de erro retornada), você pode implementar a interface dedicada `BindUnmarshaler`.

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

> **Nota:** Se um tipo implementa tanto `encoding.TextUnmarshaler` quanto `BindUnmarshaler`, o Gin usará `BindUnmarshaler` por padrão, a menos que você especifique `parser=encoding.TextUnmarshaler` na tag de binding.
