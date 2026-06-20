---
title: "헤더 바인딩"
sidebar:
  order: 9
---

`ShouldBindHeader`는 `header` 구조체 태그를 사용하여 HTTP 요청 헤더를 구조체에 직접 바인딩합니다. API 요청 제한, 인증 토큰 또는 커스텀 도메인 헤더와 같은 메타데이터를 수신 요청에서 추출하는 데 유용합니다.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

type testHeader struct {
  Rate   int    `header:"Rate"`
  Domain string `header:"Domain"`
}

func main() {
  r := gin.Default()

  r.GET("/", func(c *gin.Context) {
    h := testHeader{}

    if err := c.ShouldBindHeader(&h); err != nil {
      c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      return
    }

    c.JSON(http.StatusOK, gin.H{"Rate": h.Rate, "Domain": h.Domain})
  })

  r.Run(":8080")
}
```

## 테스트

```sh
# Pass custom headers
curl -H "Rate:300" -H "Domain:music" http://localhost:8080/
# Output: {"Domain":"music","Rate":300}

# Missing headers -- zero values are used
curl http://localhost:8080/
# Output: {"Domain":"","Rate":0}
```

:::note
헤더 이름은 HTTP 사양에 따라 대소문자를 구분하지 않습니다. `header` 구조체 태그 값은 대소문자를 구분하지 않고 매칭되므로 `header:"Rate"`는 `Rate`, `rate` 또는 `RATE`로 전송된 헤더와 매칭됩니다.
:::

:::tip
`header` 태그를 `binding:"required"`와 결합하여 필수 헤더가 없는 요청을 거부할 수 있습니다:

```go
type authHeader struct {
  Token string `header:"Authorization" binding:"required"`
}
```

:::

## 참고

- [바인딩과 유효성 검사](/ko-kr/docs/binding/binding-and-validation/)
- [쿼리 문자열 또는 POST 데이터 바인딩](/ko-kr/docs/binding/bind-query-or-post/)
