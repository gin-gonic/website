---
title: "PureJSON"
sidebar:
  order: 5
---

일반적으로 Go의 `json.Marshal`은 안전을 위해 특수 HTML 문자를 유니코드 이스케이프 시퀀스로 대체합니다 -- 예를 들어 `<`는 `\u003c`가 됩니다. HTML에 JSON을 삽입할 때는 괜찮지만, 순수 API를 구축하는 경우 클라이언트는 리터럴 문자를 기대할 수 있습니다.

`c.PureJSON`은 `SetEscapeHTML(false)`를 설정한 `json.Encoder`를 사용하므로 `<`, `>`, `&`와 같은 HTML 문자가 이스케이프되지 않고 그대로 렌더링됩니다.

API 소비자가 원시 비이스케이프 JSON을 기대하는 경우 `PureJSON`을 사용하세요. 응답이 HTML 페이지에 삽입될 수 있는 경우 표준 `JSON`을 사용하세요.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  // Standard JSON -- escapes HTML characters
  router.GET("/json", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{
      "html": "<b>Hello, world!</b>",
    })
  })

  // PureJSON -- serves literal characters
  router.GET("/purejson", func(c *gin.Context) {
    c.PureJSON(http.StatusOK, gin.H{
      "html": "<b>Hello, world!</b>",
    })
  })

  router.Run(":8080")
}
```

## 테스트

```sh
# Standard JSON -- HTML characters are escaped
curl http://localhost:8080/json
# Output: {"html":"\u003cb\u003eHello, world!\u003c/b\u003e"}

# PureJSON -- HTML characters are literal
curl http://localhost:8080/purejson
# Output: {"html":"<b>Hello, world!</b>"}
```

:::tip
Gin은 미들웨어 체인을 중단하면서 비이스케이프 JSON을 반환하기 위한 `c.AbortWithStatusPureJSON` (v1.11+)도 제공합니다 -- 인증이나 유효성 검사 미들웨어에서 유용합니다.
:::

## 참고

- [AsciiJSON](/ko-kr/docs/rendering/ascii-json/)
- [SecureJSON](/ko-kr/docs/rendering/secure-json/)
- [렌더링](/ko-kr/docs/rendering/rendering/)
