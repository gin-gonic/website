---
title: "Let's Encrypt 지원"
sidebar:
  order: 3
---

[gin-gonic/autotls](https://github.com/gin-gonic/autotls) 패키지는 Let's Encrypt를 통한 자동 HTTPS를 제공합니다. 인증서 발급과 갱신을 자동으로 처리하므로 최소한의 설정으로 HTTPS를 서비스할 수 있습니다.

## 빠른 시작

가장 간단한 방법은 라우터와 하나 이상의 도메인 이름으로 `autotls.Run`을 호출하는 것입니다:

```go
package main

import (
  "log"

  "github.com/gin-gonic/autotls"
  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.GET("/ping", func(c *gin.Context) {
    c.String(200, "pong")
  })

  log.Fatal(autotls.Run(router, "example1.com", "example2.com"))
}
```

## 커스텀 자동 인증서 관리자

인증서 캐시 디렉터리 지정이나 허용된 호스트 이름 제한과 같은 더 세밀한 제어를 위해 커스텀 `autocert.Manager`와 함께 `autotls.RunWithManager`를 사용합니다:

```go
package main

import (
  "log"

  "github.com/gin-gonic/autotls"
  "github.com/gin-gonic/gin"
  "golang.org/x/crypto/acme/autocert"
)

func main() {
  router := gin.Default()

  router.GET("/ping", func(c *gin.Context) {
    c.String(200, "pong")
  })

  m := autocert.Manager{
    Prompt:     autocert.AcceptTOS,
    HostPolicy: autocert.HostWhitelist("example1.com", "example2.com"),
    Cache:      autocert.DirCache("/var/www/.cache"),
  }

  log.Fatal(autotls.RunWithManager(router, &m))
}
```

:::note
Let's Encrypt는 서버가 공용 인터넷에서 포트 80과 443으로 접근 가능해야 합니다. localhost나 인바운드 연결을 차단하는 방화벽 뒤에서는 작동하지 않습니다.
:::

## 참고

- [커스텀 HTTP 설정](/ko-kr/docs/server-config/custom-http-config/)
