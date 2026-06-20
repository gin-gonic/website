---
title: "우아한 재시작 또는 중지"
sidebar:
  order: 5
---

서버 프로세스가 종료 신호를 받으면(예: 배포 또는 스케일링 이벤트 중), 즉시 종료하면 모든 진행 중인 요청이 삭제되어 클라이언트에게 끊어진 연결과 잠재적으로 손상된 작업이 남게 됩니다. **우아한 종료**는 다음을 통해 이를 해결합니다:

- **진행 중인 요청 완료** -- 이미 처리 중인 요청에 완료할 시간을 주어 클라이언트가 연결 재설정 대신 적절한 응답을 받도록 합니다.
- **연결 배출** -- 서버가 새 연결 수락을 중지하고 기존 연결이 완료되도록 하여 갑작스러운 차단을 방지합니다.
- **리소스 정리** -- 열린 데이터베이스 연결, 파일 핸들, 백그라운드 워커가 올바르게 닫혀 데이터 손상이나 리소스 누수를 방지합니다.
- **무중단 배포 지원** -- 로드 밸런서와 결합하면 우아한 종료를 통해 사용자에게 보이는 오류 없이 새 버전을 롤아웃할 수 있습니다.

Go에서 이를 달성하는 방법은 여러 가지가 있습니다.

[fvbock/endless](https://github.com/fvbock/endless)를 사용하여 기본 `ListenAndServe`를 대체할 수 있습니다. 자세한 내용은 이슈 [#296](https://github.com/gin-gonic/gin/issues/296)을 참조하세요.

```go
router := gin.Default()
router.GET("/", handler)
// [...]
endless.ListenAndServe(":4242", router)
```

endless의 대안:

* [manners](https://github.com/braintree/manners): 우아하게 종료되는 예의 바른 Go HTTP 서버.
* [graceful](https://github.com/tylerb/graceful): http.Handler 서버의 우아한 종료를 가능하게 하는 Go 패키지.
* [grace](https://github.com/facebookgo/grace): Go 서버를 위한 우아한 재시작 및 무중단 배포.

Go 1.8 이상을 사용하는 경우 이 라이브러리를 사용할 필요가 없을 수 있습니다! 우아한 종료를 위해 `http.Server`의 내장 [Shutdown()](https://golang.org/pkg/net/http/#Server.Shutdown) 메서드를 사용하는 것을 고려하세요. gin을 사용한 완전한 [graceful-shutdown](https://github.com/gin-gonic/examples/tree/master/graceful-shutdown) 예제를 참조하세요.

```go
//go:build go1.8
// +build go1.8

package main

import (
  "context"
  "log"
  "net/http"
  "os"
  "os/signal"
  "syscall"
  "time"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()
  router.GET("/", func(c *gin.Context) {
    time.Sleep(5 * time.Second)
    c.String(http.StatusOK, "Welcome Gin Server")
  })

  srv := &http.Server{
    Addr:    ":8080",
    Handler: router.Handler(),
  }

  go func() {
    // 서비스 연결
    if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
      log.Fatalf("listen: %s\n", err)
    }
  }()

  // 인터럽트 신호를 기다려 서버를 우아하게 종료합니다
  // 5초의 타임아웃을 둡니다.
  quit := make(chan os.Signal, 1)
  // kill (매개변수 없음)은 기본적으로 syscall.SIGTERM을 보냅니다
  // kill -2는 syscall.SIGINT입니다
  // kill -9는 syscall.SIGKILL이지만 잡을 수 없으므로 추가할 필요 없습니다
  signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
  <-quit
  log.Println("Shutdown Server ...")

  ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
  defer cancel()
  if err := srv.Shutdown(ctx); err != nil {
    log.Println("Server Shutdown:", err)
  }
  log.Println("Server exiting")
}
```
