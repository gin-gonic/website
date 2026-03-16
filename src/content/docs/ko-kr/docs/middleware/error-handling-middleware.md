---
title: "오류 처리 미들웨어"
sidebar:
  order: 4
---

일반적인 RESTful 애플리케이션에서는 잘못된 입력, 데이터베이스 장애, 인증되지 않은 접근 또는 내부 버그 등 모든 라우트에서 오류를 만날 수 있습니다. 각 핸들러에서 개별적으로 오류를 처리하면 반복적인 코드와 일관성 없는 응답이 발생합니다.

중앙 집중식 오류 처리 미들웨어는 각 요청 후에 실행되어 `c.Error(err)`를 통해 Gin 컨텍스트에 추가된 오류를 확인함으로써 이 문제를 해결합니다. 오류가 발견되면 적절한 상태 코드와 함께 구조화된 JSON 응답을 보냅니다.

```go
package main

import (
  "errors"
  "net/http"

  "github.com/gin-gonic/gin"
)

// ErrorHandler captures errors and returns a consistent JSON error response
func ErrorHandler() gin.HandlerFunc {
  return func(c *gin.Context) {
    c.Next() // Process the request first

    // Check if any errors were added to the context
    if len(c.Errors) > 0 {
      err := c.Errors.Last().Err

      c.JSON(http.StatusInternalServerError, gin.H{
        "success": false,
        "message": err.Error(),
      })
    }
  }
}

func main() {
  r := gin.Default()

  // Attach the error-handling middleware
  r.Use(ErrorHandler())

  r.GET("/ok", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{
      "success": true,
      "message": "Everything is fine!",
    })
  })

  r.GET("/error", func(c *gin.Context) {
    c.Error(errors.New("something went wrong"))
  })

  r.Run(":8080")
}
```

## 테스트

```sh
# Successful request
curl http://localhost:8080/ok
# Output: {"message":"Everything is fine!","success":true}

# Error request -- middleware catches the error
curl http://localhost:8080/error
# Output: {"message":"something went wrong","success":false}
```

:::tip
이 패턴을 확장하여 특정 오류 타입을 다른 HTTP 상태 코드에 매핑하거나 응답하기 전에 외부 서비스에 오류를 기록할 수 있습니다.
:::

## 참고

- [커스텀 미들웨어](/ko-kr/docs/middleware/custom-middleware/)
- [미들웨어 사용](/ko-kr/docs/middleware/using-middleware/)
