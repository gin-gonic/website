---
title: "綁定自訂反序列化器"
sidebar:
  order: 8
---

要覆寫 Gin 的預設綁定邏輯，請在你的類型上定義一個滿足 Go 標準函式庫 `encoding.TextUnmarshaler` 介面的函式。然後在要綁定的欄位的 `uri`/`form` 標籤中指定 `parser=encoding.TextUnmarshaler`。

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

測試方式：

```sh
curl 'localhost:8088/test?birthday=2000-01-01&birthdays=2000-01-01,2000-01-02'
```

結果：

```sh
{"Birthday":"2000/01/01","Birthdays":["2000/01/01","2000/01/02"],"BirthdaysDefault":["2020/09/01","2020/09/02"]}
```

> **注意：** 如果對一個**未**實作 `encoding.TextUnmarshaler` 的類型指定了 `parser=encoding.TextUnmarshaler`，Gin 會忽略它並使用預設的綁定邏輯。

### 使用 BindUnmarshaler

如果一個類型已經實作了 `encoding.TextUnmarshaler`，但你想以不同的方式自訂 Gin 的綁定行為（例如，改變回傳的錯誤訊息），你可以改為實作專用的 `BindUnmarshaler` 介面。

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

> **注意：** 如果一個類型同時實作了 `encoding.TextUnmarshaler` 和 `BindUnmarshaler`，Gin 預設會使用 `BindUnmarshaler`，除非你在綁定標籤中指定了 `parser=encoding.TextUnmarshaler`。
