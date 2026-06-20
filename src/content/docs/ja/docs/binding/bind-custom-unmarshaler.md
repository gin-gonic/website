---
title: "カスタムアンマーシャラーのバインド"
sidebar:
  order: 8
---

Ginのデフォルトのバインディングロジックをオーバーライドするには、Go標準ライブラリの`encoding.TextUnmarshaler`インターフェースを満たす関数を型に定義します。次に、バインドされるフィールドの`uri`/`form`タグに`parser=encoding.TextUnmarshaler`を指定します。

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

テスト方法：

```sh
curl 'localhost:8088/test?birthday=2000-01-01&birthdays=2000-01-01,2000-01-02'
```

結果：

```sh
{"Birthday":"2000/01/01","Birthdays":["2000/01/01","2000/01/02"],"BirthdaysDefault":["2020/09/01","2020/09/02"]}
```

> **注意：** `encoding.TextUnmarshaler`を実装して**いない**型に`parser=encoding.TextUnmarshaler`が指定された場合、Ginはそれを無視してデフォルトのバインディングロジックで処理します。

### BindUnmarshalerの使用

型がすでに`encoding.TextUnmarshaler`を実装しているが、Ginでの型のバインド方法を異なる方法でカスタマイズしたい場合（例：返されるエラーメッセージを変更したい場合）、代わりに専用の`BindUnmarshaler`インターフェースを実装できます。

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

> **注意：** 型が`encoding.TextUnmarshaler`と`BindUnmarshaler`の両方を実装している場合、バインディングタグで`parser=encoding.TextUnmarshaler`を指定しない限り、Ginはデフォルトで`BindUnmarshaler`を使用します。
