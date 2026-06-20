---
title: "绑定自定义反序列化器"
sidebar:
  order: 8
---

要覆盖 Gin 的默认绑定逻辑，请在你的类型上定义一个满足 Go 标准库中 `encoding.TextUnmarshaler` 接口的函数。然后在要绑定的字段的 `uri`/`form` 标签中指定 `parser=encoding.TextUnmarshaler`。

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

测试：

```sh
curl 'localhost:8088/test?birthday=2000-01-01&birthdays=2000-01-01,2000-01-02'
```

结果：

```sh
{"Birthday":"2000/01/01","Birthdays":["2000/01/01","2000/01/02"],"BirthdaysDefault":["2020/09/01","2020/09/02"]}
```

> **注意：** 如果为一个**没有**实现 `encoding.TextUnmarshaler` 的类型指定了 `parser=encoding.TextUnmarshaler`，Gin 会忽略它并使用默认绑定逻辑。

### 使用 BindUnmarshaler

如果一个类型已经实现了 `encoding.TextUnmarshaler`，但你希望自定义 Gin 绑定该类型的方式（例如更改返回的错误消息），可以改为实现专用的 `BindUnmarshaler` 接口。

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

> **注意：** 如果一个类型同时实现了 `encoding.TextUnmarshaler` 和 `BindUnmarshaler`，Gin 默认会使用 `BindUnmarshaler`，除非你在绑定标签中指定了 `parser=encoding.TextUnmarshaler`。
