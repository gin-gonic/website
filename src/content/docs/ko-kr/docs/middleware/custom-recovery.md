---
title: "커스텀 복구 동작"
sidebar:
  order: 4
---

Gin에 내장된 `gin.Recovery()` 미들웨어는 요청을 처리하는 동안 발생하는 모든 패닉을 잡아서 `500` 응답을 작성하고 서버를 계속 실행되도록 유지합니다. 복구 시 일어나는 동작을 제어해야 할 때 -- 예를 들어 사용자에게 패닉을 보고하거나, 데이터베이스에 저장하거나, 오류 추적 서비스로 전송할 때 -- 에는 대신 `gin.CustomRecovery()`를 사용합니다.

`gin.CustomRecovery()`는 `func(c *gin.Context, recovered any)` 시그니처를 가진 핸들러를 받습니다. `recovered` 값은 `panic()`에 전달된 모든 값입니다. 핸들러 내부에서 응답 방식을 결정한 다음 `c.AbortWithStatus()`(또는 다른 중단 메서드)를 호출하여 나머지 핸들러를 건너뛰도록 합니다.

```go
package main

import (
  "fmt"
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  // 기본적으로 미들웨어가 없는 라우터를 생성합니다
  r := gin.New()

  // 전역 미들웨어
  // Logger 미들웨어는 GIN_MODE=release로 설정하더라도 로그를 gin.DefaultWriter에 작성합니다.
  // 기본적으로 gin.DefaultWriter = os.Stdout 입니다
  r.Use(gin.Logger())

  // Recovery 미들웨어는 모든 패닉으로부터 복구하고 패닉이 있었던 경우 500을 작성합니다.
  r.Use(gin.CustomRecovery(func(c *gin.Context, recovered any) {
    if err, ok := recovered.(string); ok {
      c.String(http.StatusInternalServerError, fmt.Sprintf("error: %s", err))
    }
    c.AbortWithStatus(http.StatusInternalServerError)
  }))

  r.GET("/panic", func(c *gin.Context) {
    // 문자열로 패닉을 발생시킵니다 -- 커스텀 미들웨어는 이를 데이터베이스에 저장하거나 사용자에게 보고할 수 있습니다
    panic("foo")
  })

  r.GET("/", func(c *gin.Context) {
    c.String(http.StatusOK, "ohai")
  })

  // 0.0.0.0:8080에서 수신 대기 및 서비스
  r.Run(":8080")
}
```

## 테스트해 보기

```bash
# 패닉을 발생시킵니다; 커스텀 복구 핸들러가 메시지를 반환합니다
curl http://localhost:8080/panic
# => error: foo

# 일반 요청은 여전히 정상적으로 동작합니다
curl http://localhost:8080/
# => ohai
```

## 참고

- [커스텀 미들웨어](/ko-kr/docs/middleware/custom-middleware/)
- [기본적으로 미들웨어가 없는 빈 Gin](/ko-kr/docs/middleware/without-middleware/)
- [오류 처리 미들웨어](/ko-kr/docs/middleware/error-handling-middleware/)
