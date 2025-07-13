---
title: "Graceful 재시작과 정지"
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

* [manners](https://github.com/braintree/manners): 요청 처리를 마친 뒤 서버를 정상적으로 종료하는 Go HTTP 서버입니다.
* [graceful](https://github.com/tylerb/graceful): http.Handler 기반 서버의 정상 종료를 지원하는 Go 패키지입니다.
* [grace](https://github.com/facebookgo/grace): 서버를 무중단으로 재시작하고 배포할 수 있도록 지원합니다.

만약 Go 1.8을 사용한다면, 이 라이브러리를 사용할 필요가 없습니다! Graceful 종료를 위해 http.Server에 포함되어 있는 [Shutdown()](https://golang.org/pkg/net/http/#Server.Shutdown) 메소드를 사용할 것을 검토해보세요. 자세한 내용은 Gin의 [graceful-shutdown](https://github.com/gin-gonic/examples/tree/master/graceful-shutdown) 예제에서 확인해 주세요.

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
		// service connections
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("listen: %s\n", err)
		}
	}()

	// Wait for interrupt signal to gracefully shutdown the server with
	// a timeout of 5 seconds.
	quit := make(chan os.Signal, 1)
	// kill (no params) by default sends syscall.SIGTERM
	// kill -2 is syscall.SIGINT
	// kill -9 is syscall.SIGKILL but can't be caught, so don't need add it
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

