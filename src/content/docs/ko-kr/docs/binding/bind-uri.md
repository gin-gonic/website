---
title: "URI 바인딩"
sidebar:
  order: 7
---

`ShouldBindUri`는 `uri` 구조체 태그를 사용하여 URI 경로 매개변수를 구조체에 직접 바인딩합니다. `binding` 유효성 검사 태그와 결합하면 경로 매개변수(예: 유효한 UUID 필수)를 한 번의 호출로 유효성 검사할 수 있습니다.

이는 라우트에 리소스 ID나 슬러그와 같은 구조화된 데이터가 포함되어 있어 사용 전에 유효성 검사와 타입 체크를 수행하려는 경우에 유용합니다.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

type Person struct {
  ID   string `uri:"id" binding:"required,uuid"`
  Name string `uri:"name" binding:"required"`
}

func main() {
  route := gin.Default()

  route.GET("/:name/:id", func(c *gin.Context) {
    var person Person
    if err := c.ShouldBindUri(&person); err != nil {
      c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      return
    }
    c.JSON(http.StatusOK, gin.H{"name": person.Name, "uuid": person.ID})
  })

  route.Run(":8088")
}
```

## 테스트

```sh
# Valid UUID -- binding succeeds
curl http://localhost:8088/thinkerou/987fbc97-4bed-5078-9f07-9141ba07c9f3
# Output: {"name":"thinkerou","uuid":"987fbc97-4bed-5078-9f07-9141ba07c9f3"}

# Invalid UUID -- binding fails with validation error
curl http://localhost:8088/thinkerou/not-uuid
# Output: {"error":"Key: 'Person.ID' Error:Field validation for 'ID' failed on the 'uuid' tag"}
```

:::note
`uri` 구조체 태그 이름은 라우트 정의의 매개변수 이름과 일치해야 합니다. 예를 들어, 라우트의 `:id`는 구조체의 `uri:"id"`에 해당합니다.
:::

## 참고

- [경로의 매개변수](/ko-kr/docs/routing/param-in-path/)
- [바인딩과 유효성 검사](/ko-kr/docs/binding/binding-and-validation/)
