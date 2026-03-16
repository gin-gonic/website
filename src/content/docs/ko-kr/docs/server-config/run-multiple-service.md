---
title: "다중 서비스 실행"
sidebar:
  order: 4
---

`golang.org/x/sync/errgroup` 패키지의 `errgroup.Group`을 사용하여 동일한 프로세스에서 각각 다른 포트에서 여러 Gin 서버를 실행할 수 있습니다. 이는 별도의 바이너리를 배포하지 않고 분리된 API를 노출해야 할 때 유용합니다 (예: 포트 8080의 공개 API와 포트 8081의 관리자 API).

각 서버는 자체 라우터, 미들웨어 스택 및 `http.Server` 설정을 가집니다.

```go
package main

import (
  "log"
  "net/http"
  "time"

  "github.com/gin-gonic/gin"
  "golang.org/x/sync/errgroup"
)

var (
  g errgroup.Group
)

func router01() http.Handler {
  e := gin.New()
  e.Use(gin.Recovery())
  e.GET("/", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{
      "code":    http.StatusOK,
      "message": "Welcome server 01",
    })
  })

  return e
}

func router02() http.Handler {
  e := gin.New()
  e.Use(gin.Recovery())
  e.GET("/", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{
      "code":    http.StatusOK,
      "message": "Welcome server 02",
    })
  })

  return e
}

func main() {
  server01 := &http.Server{
    Addr:         ":8080",
    Handler:      router01(),
    ReadTimeout:  5 * time.Second,
    WriteTimeout: 10 * time.Second,
  }

  server02 := &http.Server{
    Addr:         ":8081",
    Handler:      router02(),
    ReadTimeout:  5 * time.Second,
    WriteTimeout: 10 * time.Second,
  }

  g.Go(func() error {
    return server01.ListenAndServe()
  })

  g.Go(func() error {
    return server02.ListenAndServe()
  })

  if err := g.Wait(); err != nil {
    log.Fatal(err)
  }
}
```

## 테스트

```sh
# Server 01 on port 8080
curl http://localhost:8080/
# Output: {"code":200,"message":"Welcome server 01"}

# Server 02 on port 8081
curl http://localhost:8081/
# Output: {"code":200,"message":"Welcome server 02"}
```

:::note
서버 중 하나라도 시작에 실패하면 (예: 포트가 이미 사용 중인 경우) `g.Wait()`는 첫 번째 오류를 반환합니다. 프로세스가 계속 실행되려면 두 서버 모두 성공적으로 시작되어야 합니다.
:::

## 참고

- [커스텀 HTTP 설정](/ko-kr/docs/server-config/custom-http-config/)
- [우아한 재시작 또는 중지](/ko-kr/docs/server-config/graceful-restart-or-stop/)
