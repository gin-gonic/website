---
title: "Graceful 재시작과 정지"
draft: false
---

웹 서버를 graceful 재시작 혹은 정지를 하고 싶습니까?
이 작업을 하기 위한 몇 가지 방법이 있습니다.

[fvbock/endless](https://github.com/fvbock/endless)를 사용하여 기본 `ListenAndServe`를 바꿀 수 있습니다. 자세한 내용은 이슈 [#296](https://github.com/gin-gonic/gin/issues/296)를 참조하세요.

```go
router := gin.Default()
router.GET("/", handler)
// [...]
endless.ListenAndServe(":4242", router)
```

endless의 대안은 다음과 같습니다:

* [manners](https://github.com/braintree/manners): A polite Go HTTP server that shuts down gracefully.
* [graceful](https://github.com/tylerb/graceful): Graceful is a Go package enabling graceful shutdown of an http.Handler server.
* [grace](https://github.com/facebookgo/grace): Graceful restart & zero downtime deploy for Go servers.

만약 Go 1.8을 사용한다면, 이 라이브러리를 사용할 필요가 없습니다! Graceful 종료를 위해 http.Server에 포함되어 있는 [Shutdown()](https://golang.org/pkg/net/http/#Server.Shutdown) 메소드를 사용할 것을 검토해보세요. 자세한 내용은 Gin의 [graceful-shutdown](https://github.com/gin-gonic/examples/tree/master/graceful-shutdown) 예제에서 확인해 주세요.

```go
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
		Handler: router,
	}

	go func() {
		// 서비스 접속
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("listen: %s\n", err)
		}
	}()

	// 5초의 타임아웃으로 인해 인터럽트 신호가 서버를 정상종료 할 때까지 기다립니다.
	quit := make(chan os.Signal)
	// kill (파라미터 없음) 기본값으로 syscanll.SIGTERM를 보냅니다
	// kill -2 는 syscall.SIGINT를 보냅니다
	// kill -9 는 syscall.SIGKILL를 보내지만 캐치할수 없으므로, 추가할 필요가 없습니다.
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("Shutdown Server ...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		log.Fatal("Server Shutdown:", err)
	}
	// 5초의 타임아웃으로 ctx.Done()을 캐치합니다.
	select {
	case <-ctx.Done():
		log.Println("timeout of 5 seconds.")
	}
	log.Println("Server exiting")
}
```

