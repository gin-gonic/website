---
title: "기본 미들웨어 없이 사용"
sidebar:
  order: 1
---

Gin은 라우터 엔진을 생성하는 두 가지 방법을 제공하며, 차이점은 기본으로 부착되는 미들웨어입니다.

### `gin.Default()` -- Logger와 Recovery 포함

`gin.Default()`는 두 가지 미들웨어가 이미 부착된 라우터를 생성합니다:

- **Logger** -- stdout에 요청 로그를 기록합니다 (메서드, 경로, 상태 코드, 지연 시간).
- **Recovery** -- 핸들러의 모든 패닉에서 복구하고 500 응답을 반환하여 서버가 충돌하는 것을 방지합니다.

이것은 빠르게 시작하기 위한 가장 일반적인 선택입니다.

### `gin.New()` -- 빈 엔진

`gin.New()`는 **미들웨어가 부착되지 않은** 완전히 빈 라우터를 생성합니다. 어떤 미들웨어가 실행되는지 완전히 제어하고 싶을 때 유용합니다, 예를 들어:

- 기본 텍스트 로거 대신 구조화된 로거(`slog` 또는 `zerolog` 등)를 사용하고 싶을 때.
- 패닉 복구 동작을 커스터마이즈하고 싶을 때.
- 최소한의 또는 특화된 미들웨어 스택이 필요한 마이크로서비스를 구축할 때.

### 예제

```go
package main

import (
  "log"
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  // 미들웨어 없이 빈 엔진을 생성합니다.
  r := gin.New()

  // 필요한 미들웨어만 부착합니다.
  r.Use(gin.Recovery())

  r.GET("/ping", func(c *gin.Context) {
    c.String(http.StatusOK, "pong")
  })

  log.Fatal(r.Run(":8080"))
}
```

위 예제에서 Recovery 미들웨어는 충돌 방지를 위해 포함되었지만, 기본 Logger 미들웨어는 생략되었습니다. 자체 로깅 미들웨어로 대체하거나 완전히 제외할 수 있습니다.
