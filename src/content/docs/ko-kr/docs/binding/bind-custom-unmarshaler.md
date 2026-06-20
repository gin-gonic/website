---
title: "커스텀 언마셜러 바인딩"
sidebar:
  order: 8
---

Gin의 기본 바인딩 로직을 재정의하려면, Go 표준 라이브러리의 `encoding.TextUnmarshaler` 인터페이스를 충족하는 함수를 타입에 정의하세요. 그런 다음 바인딩되는 필드의 `uri`/`form` 태그에 `parser=encoding.TextUnmarshaler`를 지정합니다.

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

다음으로 테스트하세요:

```sh
curl 'localhost:8088/test?birthday=2000-01-01&birthdays=2000-01-01,2000-01-02'
```

결과:

```sh
{"Birthday":"2000/01/01","Birthdays":["2000/01/01","2000/01/02"],"BirthdaysDefault":["2020/09/01","2020/09/02"]}
```

> **참고:** `encoding.TextUnmarshaler`를 구현하지 **않는** 타입에 `parser=encoding.TextUnmarshaler`가 지정되면, Gin은 이를 무시하고 기본 바인딩 로직으로 진행합니다.

### BindUnmarshaler 사용하기

타입이 이미 `encoding.TextUnmarshaler`를 구현하지만 Gin이 타입을 다르게 바인딩하는 방식을 커스터마이즈하고 싶다면 (예: 반환되는 오류 메시지를 변경), 전용 `BindUnmarshaler` 인터페이스를 대신 구현할 수 있습니다.

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

> **참고:** 타입이 `encoding.TextUnmarshaler`와 `BindUnmarshaler`를 모두 구현하는 경우, 바인딩 태그에 `parser=encoding.TextUnmarshaler`를 지정하지 않는 한 Gin은 기본적으로 `BindUnmarshaler`를 사용합니다.
