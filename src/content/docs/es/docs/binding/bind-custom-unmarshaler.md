---
title: "Enlazar con unmarshaler personalizado"
sidebar:
  order: 8
---

Para sobreescribir la lógica de enlace predeterminada de Gin, define una función en tu tipo que satisfaga la interfaz `encoding.TextUnmarshaler` de la biblioteca estándar de Go. Luego especifica `parser=encoding.TextUnmarshaler` en la etiqueta `uri`/`form` del campo que se está enlazando.

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

Pruébalo con:

```sh
curl 'localhost:8088/test?birthday=2000-01-01&birthdays=2000-01-01,2000-01-02'
```

Resultado:

```sh
{"Birthday":"2000/01/01","Birthdays":["2000/01/01","2000/01/02"],"BirthdaysDefault":["2020/09/01","2020/09/02"]}
```

> **Nota:** Si se especifica `parser=encoding.TextUnmarshaler` para un tipo que **no** implementa `encoding.TextUnmarshaler`, Gin lo ignorará y procederá con su lógica de enlace predeterminada.

### Uso de BindUnmarshaler

Si un tipo ya implementa `encoding.TextUnmarshaler` pero deseas personalizar cómo Gin enlaza el tipo de manera diferente (por ejemplo, para cambiar qué mensaje de error se devuelve), puedes implementar la interfaz dedicada `BindUnmarshaler` en su lugar.

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

> **Nota:** Si un tipo implementa tanto `encoding.TextUnmarshaler` como `BindUnmarshaler`, Gin usará `BindUnmarshaler` por defecto a menos que especifiques `parser=encoding.TextUnmarshaler` en la etiqueta de enlace.
