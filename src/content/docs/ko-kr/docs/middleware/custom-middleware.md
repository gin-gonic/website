---
title: "커스텀 미들웨어"
sidebar:
  order: 3
---

Gin 미들웨어는 `gin.HandlerFunc`를 반환하는 함수입니다. 미들웨어는 메인 핸들러 이전 및/또는 이후에 실행되므로, 로깅, 인증, 오류 처리 및 기타 횡단 관심사에 유용합니다.

### 미들웨어 실행 흐름

미들웨어 함수는 `c.Next()` 호출을 기준으로 두 단계로 나뉩니다:

- **`c.Next()` 이전** -- 여기의 코드는 요청이 메인 핸들러에 도달하기 전에 실행됩니다. 시작 시간 기록, 토큰 검증 또는 `c.Set()`으로 컨텍스트 값 설정과 같은 설정 작업에 이 단계를 사용합니다.
- **`c.Next()`** -- 체인의 다음 핸들러(다른 미들웨어 또는 최종 라우트 핸들러일 수 있음)를 호출합니다. 모든 다운스트림 핸들러가 완료될 때까지 여기서 실행이 일시 중지됩니다.
- **`c.Next()` 이후** -- 여기의 코드는 메인 핸들러가 완료된 후에 실행됩니다. 정리, 응답 상태 로깅 또는 지연 시간 측정에 이 단계를 사용합니다.

체인을 완전히 중지하려면(예: 인증 실패 시), `c.Next()` 대신 `c.Abort()`를 호출하세요. 이는 나머지 핸들러의 실행을 방지합니다. 응답과 결합할 수 있습니다, 예를 들어 `c.AbortWithStatusJSON(401, gin.H{"error": "unauthorized"})`.

```go
package main

import (
  "log"
  "time"

  "github.com/gin-gonic/gin"
)

func Logger() gin.HandlerFunc {
  return func(c *gin.Context) {
    t := time.Now()

    // 예제 변수 설정
    c.Set("example", "12345")

    // 요청 전

    c.Next()

    // 요청 후
    latency := time.Since(t)
    log.Print(latency)

    // 전송 중인 상태에 접근
    status := c.Writer.Status()
    log.Println(status)
  }
}

func main() {
  r := gin.New()
  r.Use(Logger())

  r.GET("/test", func(c *gin.Context) {
    example := c.MustGet("example").(string)

    // "12345"를 출력합니다
    log.Println(example)
  })

  // 0.0.0.0:8080에서 수신 대기 및 서비스
  r.Run(":8080")
}
```

### 테스트해 보기

```bash
curl http://localhost:8080/test
```

서버 로그에 `Logger` 미들웨어를 통과하는 모든 요청의 요청 지연 시간과 HTTP 상태 코드가 표시됩니다.

## 참고

- [오류 처리 미들웨어](/ko-kr/docs/middleware/error-handling-middleware/)
- [미들웨어 사용하기](/ko-kr/docs/middleware/using-middleware/)
