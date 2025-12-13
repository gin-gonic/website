---
title: "배열의 컬렉션 포맷"
---

폼 바인딩에서 `collection_format` 구조체 태그를 사용하여 Gin이 slice/array 필드의 리스트 값을 분할하는 방식을 제어할 수 있습니다.

지원되는 포맷 (v1.11+):

- multi (기본값): 반복되는 키 또는 쉼표로 구분된 값
- csv: 쉼표로 구분된 값
- ssv: 공백으로 구분된 값
- tsv: 탭으로 구분된 값
- pipes: 파이프로 구분된 값

예제:

```go
package main

import (
  "net/http"
  "github.com/gin-gonic/gin"
)

type Filters struct {
  Tags      []string `form:"tags" collection_format:"csv"`     // /search?tags=go,web,api
  Labels    []string `form:"labels" collection_format:"multi"` // /search?labels=bug&labels=helpwanted
  IdsSSV    []int    `form:"ids_ssv" collection_format:"ssv"`  // /search?ids_ssv=1 2 3
  IdsTSV    []int    `form:"ids_tsv" collection_format:"tsv"`  // /search?ids_tsv=1\t2\t3
  Levels    []int    `form:"levels" collection_format:"pipes"` // /search?levels=1|2|3
}

func main() {
  r := gin.Default()
  r.GET("/search", func(c *gin.Context) {
    var f Filters
    if err := c.ShouldBind(&f); err != nil {
      c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      return
    }
    c.JSON(http.StatusOK, f)
  })
  r.Run(":8080")
}
```

컬렉션의 기본값 (v1.11+):

- `form` 태그에서 `default`를 사용하여 대체 값을 설정합니다.
- `multi`와 `csv`의 경우 기본값을 세미콜론으로 구분합니다: `default=1;2;3`.
- `ssv`, `tsv`, `pipes`의 경우 기본값에 자연스러운 구분자를 사용합니다.

참고: "폼 필드의 기본값 바인딩" 예제.
