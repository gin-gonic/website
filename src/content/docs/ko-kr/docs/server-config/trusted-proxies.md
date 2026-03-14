---
title: "신뢰할 수 있는 프록시"
sidebar:
  order: 8
---

Gin을 사용하면 실제 클라이언트 IP를 보유할 헤더(있는 경우)를 지정할 수 있으며, 이러한 헤더 중 하나를 지정할 수 있는 신뢰할 수 있는 프록시(또는 직접 클라이언트)를 지정할 수 있습니다.

### 신뢰할 수 있는 프록시 설정이 중요한 이유

애플리케이션이 리버스 프록시(Nginx, HAProxy, 클라우드 로드 밸런서 등) 뒤에 있을 때, 프록시는 `X-Forwarded-For` 또는 `X-Real-Ip`과 같은 헤더에 원래 클라이언트의 IP 주소를 전달합니다. 문제는 **모든 클라이언트가 이러한 헤더를 설정할 수 있다**는 것입니다. 적절한 신뢰할 수 있는 프록시 설정 없이는 공격자가 `X-Forwarded-For`를 위조하여 다음과 같은 일을 할 수 있습니다:

- **IP 기반 접근 제어 우회** -- 애플리케이션이 특정 라우트를 내부 IP 범위(예: `10.0.0.0/8`)로 제한하는 경우, 공격자가 공인 IP에서 `X-Forwarded-For: 10.0.0.1`을 보내어 제한을 완전히 우회할 수 있습니다.
- **로그 및 감사 추적 오염** -- 위조된 IP는 요청을 실제 출처로 추적할 수 없게 만들어 사고 조사를 신뢰할 수 없게 만듭니다.
- **속도 제한 회피** -- 속도 제한이 `ClientIP()`에 기반하는 경우, 각 요청이 다른 IP 주소를 주장하여 제한을 회피할 수 있습니다.

`SetTrustedProxies`는 Gin에 어떤 네트워크 주소가 합법적인 프록시인지 알려줌으로써 이를 해결합니다. `ClientIP()`가 `X-Forwarded-For` 체인을 파싱할 때, 해당 프록시가 추가한 항목만 신뢰하고 클라이언트가 앞에 추가했을 수 있는 모든 것을 폐기합니다. 요청이 직접 도착하면(신뢰할 수 있는 프록시에서 오지 않은 경우) 전달 헤더가 완전히 무시되고 원시 원격 주소가 사용됩니다.

`gin.Engine`에서 `SetTrustedProxies()` 함수를 사용하여 클라이언트 IP와 관련된 요청 헤더를 신뢰할 수 있는 클라이언트의 네트워크 주소 또는 네트워크 CIDR을 지정합니다. IPv4 주소, IPv4 CIDR, IPv6 주소 또는 IPv6 CIDR이 될 수 있습니다.

**주의:** 위 함수를 사용하여 신뢰할 수 있는 프록시를 지정하지 않으면 Gin은 기본적으로 모든 프록시를 신뢰합니다. **이는 안전하지 않습니다**. 동시에, 프록시를 사용하지 않는 경우 `Engine.SetTrustedProxies(nil)`을 사용하여 이 기능을 비활성화할 수 있으며, 그러면 `Context.ClientIP()`가 불필요한 계산을 피하기 위해 원격 주소를 직접 반환합니다.

```go
import (
  "fmt"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()
  router.SetTrustedProxies([]string{"192.168.1.2"})

  router.GET("/", func(c *gin.Context) {
    // If the client is 192.168.1.2, use the X-Forwarded-For
    // header to deduce the original client IP from the trust-
    // worthy parts of that header.
    // Otherwise, simply return the direct client IP
    fmt.Printf("ClientIP: %s\n", c.ClientIP())
  })
  router.Run()
}
```

**Notice:** If you are using a CDN service, you can set the `Engine.TrustedPlatform`
to skip TrustedProxies check, it has a higher priority than TrustedProxies.
Look at the example below:

```go
import (
  "fmt"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()
  // Use predefined header gin.PlatformXXX
  // Google App Engine
  router.TrustedPlatform = gin.PlatformGoogleAppEngine
  // Cloudflare
  router.TrustedPlatform = gin.PlatformCloudflare
  // Fly.io
  router.TrustedPlatform = gin.PlatformFlyIO
  // Or, you can set your own trusted request header. But be sure your CDN
  // prevents users from passing this header! For example, if your CDN puts
  // the client IP in X-CDN-Client-IP:
  router.TrustedPlatform = "X-CDN-Client-IP"

  router.GET("/", func(c *gin.Context) {
    // If you set TrustedPlatform, ClientIP() will resolve the
    // corresponding header and return IP directly
    fmt.Printf("ClientIP: %s\n", c.ClientIP())
  })
  router.Run()
}
```
