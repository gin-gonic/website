---
title: "배포"
draft: false
weight: 6
---

Gin 프로젝트는 모든 클라우드 제공 업체에 쉽게 배포 할 수 있습니다.

## [Render](https://render.com)

Render은 Go를 기본 지원하는 최신 클라우드 플랫폼으로, SSL관리, 데이터베이스, 무중단 배포, HTTP/2, websocket을 지원합니다.

Render의 [Gin프로젝트 배포 가이드](https://render.com/docs/deploy-go-gin)를 참조하세요.

## [Google App Engine](https://cloud.google.com/appengine/)

GAE에는 Go어플리케이션을 배포하는 두 가지 방법이 있습니다. 표준환경은 간단히 사용할 수 있으나, 사용자 정의가 어려우며 보안상의 이유로 [syscalls](https://github.com/gin-gonic/gin/issues/1639)를 사용할 수 없습니다. 가변형 환경은 모든 프레임워크와 라이브러리를 사용할 수 있습니다.

[Google App Engine의 Go](https://cloud.google.com/appengine/docs/go/)에서 자세히 알아보고 자신에게 알맞은 환경을 선택하세요.

## Self Hosted

Gin 프로젝트는 자체 호스팅 방식으로 배포할 수도 있습니다. 배포 아키텍처 및 보안 고려 사항은 대상 환경에 따라 다릅니다. 다음 섹션에서는 배포를 계획할 때 고려해야 할 구성 옵션에 대한 개략적인 개요만 제시합니다.

## Configuration Options

Gin 프로젝트 배포 설정은 환경 변수를 사용하거나 코드에서 직접 조정할 수 있습니다.

Gin을 구성하는 데 사용할 수 있는 환경 변수는 다음과 같습니다:

| Environment Variable | Description                                                                                                                                                                                                   |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PORT                 | `router.Run()`으로 Gin 서버를 시작할 때 사용할 TCP 포트입니다.                                                                                                                                           |
| GIN_MODE             | `debug`, `release`, or `test` 중 하나로 설정합니다. 디버그 출력을 언제 내보낼지와 같은 Gin 모드를 관리합니다. 코드에서도 `gin.SetMode(gin.ReleaseMode)` 또는 `gin.SetMode(gin.TestMode)` 함수를 사용하여 설정할 수 있습니다. |

다음 코드를 사용하여 Gin을 구성할 수 있습니다.

```go
// Gin의 바인드 주소나 포트를 지정하지 않음. 기본값은 포트 8080 인터페이스에 바인딩하는 것입니다.
// 인자 없이 Run()을 사용할 때, PORT 환경 변수를 사용하여 리슨 포트를 변경할 수 있습니다.
router := gin.Default()
router.Run()

// Gin의 바인드 주소와 포트를 지정합니다.
router := gin.Default()
router.Run("192.168.1.100:8080")

// 리스닝 포트만 지정합니다. 모든 인터페이스에 바인딩됩니다.
router := gin.Default()
router.Run(":8080")

// 실제 클라이언트 IP 주소를 문서화하기 위한 헤더를 설정할 때 신뢰할 수 있는 IP 주소 또는 CIDR을 지정합니다.
// 자세한 내용은 문서를 참조하세요.
router := gin.Default()
router.SetTrustedProxies([]string{"192.168.1.2"})
```

## Don't trust all proxies

Gin은 실제 클라이언트 IP(있는 경우)를 포함하는 헤더와, 해당 헤더 중 하나를 지정할 때 신뢰할 수 있는 프록시(또는 직접 클라이언트)를 지정할 수 있습니다.

gin.Engine의 함수 SetTrustedProxies()를 사용하여 클라이언트 IP와 관련된 요청 헤더가 신뢰될 수 있는 네트워크 주소 또는 네트워크 CIDR을 지정하세요. 이 값은 IPv4 주소, IPv4 CIDR, IPv6 주소 또는 IPv6 CIDR일 수 있습니다.

**주의**: 위 함수를 사용하여 신뢰할 수 있는 프록시를 지정하지 않으면, Gin은 기본적으로 모든 프록시를 신뢰합니다. 이는 안전하지 않습니다. 또한, 프록시를 사용하지 않는 경우 Engine.SetTrustedProxies(nil)을 사용하여 이 기능을 비활성화할 수 있으며, 그러면 Context.ClientIP()가 불필요한 연산을 피하기 위해 직접 원격 주소를 반환합니다.

```go
import (
  "fmt"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()
  router.SetTrustedProxies([]string{"192.168.1.2"})

  router.GET("/", func(c *gin.Context) {
    // 클라이언트가 192.168.1.2인 경우, X-Forwarded-For 헤더의 신뢰할 수 있는 부분을 사용하여 원래 클라이언트 IP를 추론합니다.
    // 그렇지 않으면, 단순히 직접 클라이언트 IP를 반환합니다.
    fmt.Printf("ClientIP: %s\n", c.ClientIP())
  })
  router.Run()
}
```

**주의**: CDN 서비스를 사용하는 경우, TrustedProxies 검사를 건너뛰기 위해 Engine.TrustedPlatform을 설정할 수 있습니다. 이 설정은 TrustedProxies보다 우선 순위가 높습니다. 아래 예제를 참고하세요:

```go
import (
  "fmt"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()
  // 미리 정의된 헤더 gin.PlatformXXX을 사용합니다.
  // Google App Engine
  router.TrustedPlatform = gin.PlatformGoogleAppEngine
  // Cloudflare
  router.TrustedPlatform = gin.PlatformCloudflare
  // Fly.io
  router.TrustedPlatform = gin.PlatformFlyIO
  // 또는, 직접 신뢰할 수 있는 요청 헤더를 설정할 수 있습니다. 하지만 CDN이 사용자가 이 헤더를 전달하지 못하도록 해야 합니다!
  // 예를 들어, CDN이 클라이언트 IP를 X-CDN-Client-IP에 넣는 경우:
  router.TrustedPlatform = "X-CDN-Client-IP"

  router.GET("/", func(c *gin.Context) {
    // TrustedPlatform을 설정한 경우, ClientIP()는 해당 헤더를 해석하여 IP를 직접 반환합니다.
    fmt.Printf("ClientIP: %s\n", c.ClientIP())
  })
  router.Run()
}
```
