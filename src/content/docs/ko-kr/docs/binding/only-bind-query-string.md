---
title: "쿼리 문자열만 바인딩"
sidebar:
  order: 3
---

`ShouldBindQuery`는 URL 쿼리 문자열 매개변수만 구조체에 바인딩하고 요청 바디는 완전히 무시합니다. POST 바디 데이터가 실수로 쿼리 매개변수를 덮어쓰지 않도록 하려는 경우에 유용합니다 -- 예를 들어, 쿼리 필터와 JSON 바디를 모두 수신하는 엔드포인트에서 사용합니다.

반면 `ShouldBind`는 GET 요청에서도 쿼리 바인딩을 사용하지만, POST 요청에서는 먼저 바디를 확인합니다. HTTP 메서드에 관계없이 명시적으로 쿼리만 바인딩하려면 `ShouldBindQuery`를 사용하세요.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

type Person struct {
  Name    string `form:"name"`
  Address string `form:"address"`
}

func main() {
  route := gin.Default()
  route.Any("/testing", startPage)
  route.Run(":8085")
}

func startPage(c *gin.Context) {
  var person Person
  if err := c.ShouldBindQuery(&person); err != nil {
    c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
    return
  }

  c.JSON(http.StatusOK, gin.H{
    "name":    person.Name,
    "address": person.Address,
  })
}
```

## 테스트

```sh
# GET with query parameters
curl "http://localhost:8085/testing?name=appleboy&address=xyz"
# Output: {"address":"xyz","name":"appleboy"}

# POST with query parameters -- body is ignored, only query is bound
curl -X POST "http://localhost:8085/testing?name=appleboy&address=xyz" \
  -d "name=ignored&address=ignored"
# Output: {"address":"xyz","name":"appleboy"}
```

## 참고

- [쿼리 문자열 또는 POST 데이터 바인딩](/ko-kr/docs/binding/bind-query-or-post/)
- [바인딩과 유효성 검사](/ko-kr/docs/binding/binding-and-validation/)
