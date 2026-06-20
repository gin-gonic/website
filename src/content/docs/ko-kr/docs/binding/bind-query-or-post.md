---
title: "쿼리 문자열 또는 POST 데이터 바인딩"
sidebar:
  order: 4
---

`ShouldBind`는 HTTP 메서드와 `Content-Type` 헤더에 따라 자동으로 바인딩 엔진을 선택합니다:

- **GET** 요청의 경우 쿼리 문자열 바인딩(`form` 태그)을 사용합니다.
- **POST/PUT** 요청의 경우 `Content-Type`을 확인하여 `application/json`에는 JSON 바인딩, `application/xml`에는 XML 바인딩, `application/x-www-form-urlencoded` 또는 `multipart/form-data`에는 폼 바인딩을 사용합니다.

이는 단일 핸들러가 수동 소스 선택 없이 쿼리 문자열과 요청 바디 모두에서 데이터를 수신할 수 있음을 의미합니다.

```go
package main

import (
  "log"
  "net/http"
  "time"

  "github.com/gin-gonic/gin"
)

type Person struct {
  Name     string    `form:"name"`
  Address  string    `form:"address"`
  Birthday time.Time `form:"birthday" time_format:"2006-01-02" time_utc:"1"`
}

func main() {
  route := gin.Default()
  route.GET("/testing", startPage)
  route.POST("/testing", startPage)
  route.Run(":8085")
}

func startPage(c *gin.Context) {
  var person Person
  if err := c.ShouldBind(&person); err != nil {
    c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
    return
  }

  log.Printf("Name: %s, Address: %s, Birthday: %s\n", person.Name, person.Address, person.Birthday)
  c.JSON(http.StatusOK, gin.H{
    "name":     person.Name,
    "address":  person.Address,
    "birthday": person.Birthday,
  })
}
```

## 테스트

```sh
# GET with query string parameters
curl "http://localhost:8085/testing?name=appleboy&address=xyz&birthday=1992-03-15"
# Output: {"address":"xyz","birthday":"1992-03-15T00:00:00Z","name":"appleboy"}

# POST with form data
curl -X POST http://localhost:8085/testing \
  -d "name=appleboy&address=xyz&birthday=1992-03-15"
# Output: {"address":"xyz","birthday":"1992-03-15T00:00:00Z","name":"appleboy"}

# POST with JSON body
curl -X POST http://localhost:8085/testing \
  -H "Content-Type: application/json" \
  -d '{"name":"appleboy","address":"xyz","birthday":"1992-03-15"}'
# Output: {"address":"xyz","birthday":"1992-03-15T00:00:00Z","name":"appleboy"}
```

:::note
`time_format` 태그는 Go의 [기준 시간 레이아웃](https://pkg.go.dev/time#pkg-constants)을 사용합니다. `2006-01-02` 형식은 "년-월-일"을 의미합니다. `time_utc:"1"` 태그는 파싱된 시간이 UTC로 설정되도록 합니다.
:::

## 참고

- [바인딩과 유효성 검사](/ko-kr/docs/binding/binding-and-validation/)
- [쿼리 문자열만 바인딩](/ko-kr/docs/binding/only-bind-query-string/)
- [헤더 바인딩](/ko-kr/docs/binding/bind-header/)
