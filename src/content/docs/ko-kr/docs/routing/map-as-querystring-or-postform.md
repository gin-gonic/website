---
title: "맵을 쿼리스트링 또는 POST 폼 매개변수로 사용"
sidebar:
  order: 6
---

때때로 키가 미리 알려지지 않은 키-값 쌍 세트를 수신해야 할 때가 있습니다 -- 예를 들어 동적 필터나 사용자 정의 메타데이터. Gin은 `c.QueryMap`과 `c.PostFormMap`을 제공하여 괄호 표기법 매개변수(예: `ids[a]=1234`)를 `map[string]string`으로 파싱합니다.

- `c.QueryMap("key")` -- URL 쿼리 문자열에서 `key[subkey]=value` 쌍을 파싱합니다.
- `c.PostFormMap("key")` -- 요청 바디에서 `key[subkey]=value` 쌍을 파싱합니다.

```go
package main

import (
  "fmt"
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.POST("/post", func(c *gin.Context) {
    ids := c.QueryMap("ids")
    names := c.PostFormMap("names")

    fmt.Printf("ids: %v; names: %v\n", ids, names)
    c.JSON(http.StatusOK, gin.H{
      "ids":   ids,
      "names": names,
    })
  })

  router.Run(":8080")
}
```

## 테스트

```sh
curl -X POST "http://localhost:8080/post?ids[a]=1234&ids[b]=hello" \
  -d "names[first]=thinkerou&names[second]=tianou"
# Output: {"ids":{"a":"1234","b":"hello"},"names":{"first":"thinkerou","second":"tianou"}}
```

:::note
괄호 표기법 `ids[a]=1234`는 일반적인 규칙입니다. Gin은 괄호 안의 부분을 맵 키로 파싱합니다. 단일 수준 괄호만 지원되며 -- `ids[a][b]=value`와 같은 중첩 괄호는 중첩 맵으로 파싱되지 않습니다.
:::

## 참고

- [쿼리 문자열 매개변수](/ko-kr/docs/routing/querystring-param/)
- [쿼리와 POST 폼](/ko-kr/docs/routing/query-and-post-form/)
