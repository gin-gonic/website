---
title: "커스텀 HTTP 설정"
sidebar:
  order: 1
---

기본적으로 `router.Run()`은 기본 HTTP 서버를 시작합니다. 프로덕션 환경에서는 타임아웃, 헤더 제한 또는 TLS 설정을 커스터마이즈해야 할 수 있습니다. 자체 `http.Server`를 생성하고 Gin 라우터를 `Handler`로 전달하여 이를 수행할 수 있습니다.

## 기본 사용법

Gin 라우터를 `http.ListenAndServe`에 직접 전달합니다:

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.GET("/ping", func(c *gin.Context) {
    c.String(http.StatusOK, "pong")
  })

  http.ListenAndServe(":8080", router)
}
```

## 커스텀 서버 설정

`http.Server` 구조체를 생성하여 읽기/쓰기 타임아웃 및 기타 옵션을 설정합니다:

```go
package main

import (
  "net/http"
  "time"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.GET("/ping", func(c *gin.Context) {
    c.String(http.StatusOK, "pong")
  })

  s := &http.Server{
    Addr:           ":8080",
    Handler:        router,
    ReadTimeout:    10 * time.Second,
    WriteTimeout:   10 * time.Second,
    MaxHeaderBytes: 1 << 20,
  }
  s.ListenAndServe()
}
```

## 테스트

```sh
curl http://localhost:8080/ping
# Output: pong
```

## 참고

- [우아한 재시작 또는 중지](/ko-kr/docs/server-config/graceful-restart-or-stop/)
- [다중 서비스 실행](/ko-kr/docs/server-config/run-multiple-service/)
