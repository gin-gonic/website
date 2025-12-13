---
title: "폼 필드의 기본값 바인딩"
---

클라이언트가 값을 보내지 않을 때 필드가 기본값으로 대체되길 원할 때가 있습니다. Gin의 폼 바인딩은 `form` 구조체 태그의 `default` 옵션을 통해 기본값을 지원합니다. 이는 스칼라 값에 대해 작동하며, Gin v1.11부터는 명시적인 컬렉션 형식을 가진 컬렉션(슬라이스/배열)에도 적용됩니다.

핵심 포인트:

- 기본값은 폼 키 바로 뒤에 배치합니다: `form:"name,default=William"`.
- 컬렉션의 경우, `collection_format:"multi|csv|ssv|tsv|pipes"`로 값을 분리하는 방법을 지정합니다.
- `multi`와 `csv`의 경우, 기본값에서 세미콜론을 사용하여 값을 구분합니다 (예: `default=1;2;3`). Gin은 내부적으로 이를 쉼표로 변환하여 태그 파서가 모호하지 않게 합니다.
- `ssv` (공백), `tsv` (탭), `pipes` (|)의 경우, 기본값에 자연스러운 구분자를 사용합니다.

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
    if err := c.ShouldBind(&req); err != nil { // Content-Type에서 바인더 추론
      c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      return
    }
    c.JSON(http.StatusOK, req)
  })
  _ = r.Run(":8080")
}
```

본문 없이 POST하면 Gin은 기본값으로 응답합니다:

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

참고 및 주의사항:

- 쉼표는 Go 구조체 태그 문법에서 옵션을 구분하는 데 사용됩니다. 기본값 내에 쉼표를 포함하지 마세요.
- `multi`와 `csv`의 경우, 세미콜론이 기본값을 구분합니다. 이 형식들에서는 개별 기본값 내에 세미콜론을 포함하지 마세요.
- 잘못된 `collection_format` 값은 바인딩 오류를 발생시킵니다.

관련 변경사항:

- 폼 바인딩을 위한 컬렉션 형식 (`multi`, `csv`, `ssv`, `tsv`, `pipes`)이 v1.11 경에 개선되었습니다.
- 컬렉션의 기본값이 v1.11에서 추가되었습니다 (PR #4048).
