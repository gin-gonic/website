---
title: "쿼리 문자열 매개변수"
sidebar:
  order: 3
---

쿼리 문자열 매개변수는 URL에서 `?` 뒤에 오는 키-값 쌍입니다 (예: `/search?q=gin&page=2`). Gin은 이를 읽기 위한 두 가지 메서드를 제공합니다:

- `c.Query("key")`는 쿼리 매개변수의 값을 반환하며, 키가 없으면 **빈 문자열**을 반환합니다.
- `c.DefaultQuery("key", "default")`는 값을 반환하며, 키가 없으면 지정된 **기본값**을 반환합니다.

두 메서드 모두 `c.Request.URL.Query()`에 접근하는 단축 방법으로, 보일러플레이트 코드를 줄여줍니다.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  // Query string parameters are parsed using the existing underlying request object.
  // The request responds to a url matching:  /welcome?firstname=Jane&lastname=Doe
  router.GET("/welcome", func(c *gin.Context) {
    firstname := c.DefaultQuery("firstname", "Guest")
    lastname := c.Query("lastname") // shortcut for c.Request.URL.Query().Get("lastname")

    c.String(http.StatusOK, "Hello %s %s", firstname, lastname)
  })
  router.Run(":8080")
}
```

## 테스트

```sh
# Both parameters provided
curl "http://localhost:8080/welcome?firstname=Jane&lastname=Doe"
# Output: Hello Jane Doe

# Missing firstname -- uses default value "Guest"
curl "http://localhost:8080/welcome?lastname=Doe"
# Output: Hello Guest Doe

# No parameters at all
curl "http://localhost:8080/welcome"
# Output: Hello Guest
```

## 참고

- [경로의 매개변수](/ko-kr/docs/routing/param-in-path/)
