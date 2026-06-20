---
title: "폼 필드의 기본값 바인딩"
sidebar:
  order: 5
---

클라이언트가 값을 보내지 않을 때 필드가 기본값으로 대체되기를 원하는 경우가 있습니다. Gin의 폼 바인딩은 `form` 구조체 태그의 `default` 옵션을 통해 기본값을 지원합니다. 이는 스칼라 값에 적용되며, Gin v1.11부터는 명시적 컬렉션 형식을 가진 컬렉션(슬라이스/배열)에도 적용됩니다.

주요 사항:

- 폼 키 바로 뒤에 기본값을 넣습니다: `form:"name,default=William"`.
- 컬렉션의 경우, `collection_format:"multi|csv|ssv|tsv|pipes"`로 값을 분할하는 방법을 지정합니다.
- `multi`와 `csv`의 경우, 기본값에서 세미콜론으로 값을 구분합니다 (예: `default=1;2;3`). Gin은 태그 파서의 모호성을 방지하기 위해 내부적으로 이를 쉼표로 변환합니다.
- `ssv`(공백), `tsv`(탭), `pipes`(|)의 경우, 기본값에 자연 구분자를 사용합니다.

예제:

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

type Person struct {
  Name      string    `form:"name,default=William"`
  Age       int       `form:"age,default=10"`
  Friends   []string  `form:"friends,default=Will;Bill"`                     // multi/csv: 기본값에 ; 사용
  Addresses [2]string `form:"addresses,default=foo bar" collection_format:"ssv"`
  LapTimes  []int     `form:"lap_times,default=1;2;3" collection_format:"csv"`
}

func main() {
  r := gin.Default()
  r.POST("/person", func(c *gin.Context) {
    var req Person
    if err := c.ShouldBind(&req); err != nil { // Content-Type에 따라 바인더를 추론
      c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      return
    }
    c.JSON(http.StatusOK, req)
  })
  _ = r.Run(":8080")
}
```

바디 없이 POST하면 Gin이 기본값으로 응답합니다:

```sh
curl -X POST http://localhost:8080/person
```

응답 (예시):

```json
{
  "Name": "William",
  "Age": 10,
  "Friends": ["Will", "Bill"],
  "Addresses": ["foo", "bar"],
  "LapTimes": [1, 2, 3]
}
```

참고 사항 및 주의점:

- 쉼표는 Go 구조체 태그 구문에서 옵션을 구분하는 데 사용됩니다. 기본값 내에 쉼표를 사용하지 마세요.
- `multi`와 `csv`의 경우 세미콜론이 기본값을 구분합니다. 이 형식에서는 개별 기본값 내에 세미콜론을 포함하지 마세요.
- 잘못된 `collection_format` 값은 바인딩 오류를 발생시킵니다.

관련 변경 사항:

- 폼 바인딩을 위한 컬렉션 형식(`multi`, `csv`, `ssv`, `tsv`, `pipes`)은 v1.11 쯤에 강화되었습니다.
- 컬렉션의 기본값은 v1.11에서 추가되었습니다 (PR #4048).
