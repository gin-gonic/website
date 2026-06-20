---
title: "보안 헤더"
sidebar:
  order: 7
---

일반적인 보안 취약점으로부터 웹 애플리케이션을 보호하기 위해 보안 헤더를 사용하는 것이 중요합니다. 이 예제에서는 Gin 애플리케이션에 보안 헤더를 추가하는 방법과 Host Header Injection 관련 공격(SSRF, Open Redirection)을 방지하는 방법을 보여줍니다.

### 각 헤더가 보호하는 것

| 헤더 | 목적 |
|--------|---------|
| `X-Content-Type-Options: nosniff` | MIME 타입 스니핑 공격을 방지합니다. 이 헤더가 없으면 브라우저가 선언된 것과 다른 콘텐츠 타입으로 파일을 해석할 수 있어, 공격자가 무해한 파일 타입으로 위장한 악성 스크립트를 실행할 수 있습니다 (예: 실제로는 JavaScript인 `.jpg` 업로드). |
| `X-Frame-Options: DENY` | 페이지가 `<iframe>` 내에 로드되는 것을 비활성화하여 클릭재킹을 방지합니다. 공격자는 클릭재킹을 사용하여 합법적인 페이지 위에 보이지 않는 프레임을 겹쳐 사용자가 숨겨진 버튼(예: "계정 삭제")을 클릭하도록 속입니다. |
| `Content-Security-Policy` | 브라우저가 로드할 수 있는 리소스(스크립트, 스타일, 이미지, 폰트 등)와 출처를 제어합니다. 인라인 스크립트를 차단하고 스크립트 소스를 제한할 수 있으므로 크로스 사이트 스크립팅(XSS)에 대한 가장 효과적인 방어 중 하나입니다. |
| `X-XSS-Protection: 1; mode=block` | 브라우저의 내장 XSS 필터를 활성화합니다. 이 헤더는 현대 브라우저에서 대부분 사용되지 않지만(Chrome은 2019년에 XSS Auditor를 제거), 구형 브라우저 사용자에게 심층 방어를 제공합니다. |
| `Strict-Transport-Security` | 지정된 `max-age` 기간 동안 도메인에 대한 모든 향후 요청에 HTTPS를 사용하도록 브라우저를 강제합니다. 프로토콜 다운그레이드 공격과 비보안 HTTP 연결을 통한 쿠키 하이재킹을 방지합니다. `includeSubDomains` 지시문은 모든 서브도메인으로 이 보호를 확장합니다. |
| `Referrer-Policy: strict-origin` | 발신 요청과 함께 전송되는 리퍼러 정보의 양을 제어합니다. 이 헤더가 없으면 토큰이나 민감한 데이터를 포함할 수 있는 전체 URL(쿼리 매개변수 포함)이 타사 사이트에 유출될 수 있습니다. `strict-origin`은 HTTPS를 통해서만 출처(도메인)만 전송합니다. |
| `Permissions-Policy` | 페이지에서 사용할 수 있는 브라우저 기능(위치 정보, 카메라, 마이크 등)을 제한합니다. 공격자가 스크립트를 주입하더라도 해당 스크립트가 민감한 기기 API에 접근할 수 없으므로 피해를 제한합니다. |

### 예제

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  r := gin.Default()

  expectedHost := "localhost:8080"

  // 보안 헤더 설정
  r.Use(func(c *gin.Context) {
    if c.Request.Host != expectedHost {
      c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Invalid host header"})
      return
    }
    c.Header("X-Frame-Options", "DENY")
    c.Header("Content-Security-Policy", "default-src 'self'; connect-src *; font-src *; script-src-elem * 'unsafe-inline'; img-src * data:; style-src * 'unsafe-inline';")
    c.Header("X-XSS-Protection", "1; mode=block")
    c.Header("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
    c.Header("Referrer-Policy", "strict-origin")
    c.Header("X-Content-Type-Options", "nosniff")
    c.Header("Permissions-Policy", "geolocation=(),midi=(),sync-xhr=(),microphone=(),camera=(),magnetometer=(),gyroscope=(),fullscreen=(self),payment=()")
    c.Next()
  })

  r.GET("/ping", func(c *gin.Context) {
    c.JSON(200, gin.H{
      "message": "pong",
    })
  })

  r.Run() // 0.0.0.0:8080에서 수신 대기 및 서비스
}
```

`curl`로 테스트할 수 있습니다:

```bash
// 헤더 확인

curl localhost:8080/ping -I

HTTP/1.1 404 Not Found
Content-Security-Policy: default-src 'self'; connect-src *; font-src *; script-src-elem * 'unsafe-inline'; img-src * data:; style-src * 'unsafe-inline';
Content-Type: text/plain
Permissions-Policy: geolocation=(),midi=(),sync-xhr=(),microphone=(),camera=(),magnetometer=(),gyroscope=(),fullscreen=(self),payment=()
Referrer-Policy: strict-origin
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-Xss-Protection: 1; mode=block
Date: Sat, 30 Mar 2024 08:20:44 GMT
Content-Length: 18

// Host Header Injection 확인

curl localhost:8080/ping -I -H "Host:neti.ee"

HTTP/1.1 400 Bad Request
Content-Type: application/json; charset=utf-8
Date: Sat, 30 Mar 2024 08:21:09 GMT
Content-Length: 31
```

선택적으로, [gin helmet](https://github.com/danielkov/gin-helmet) `go get github.com/danielkov/gin-helmet/ginhelmet`을 사용할 수 있습니다.

```go
package main

import (
  "github.com/gin-gonic/gin"
  "github.com/danielkov/gin-helmet/ginhelmet"
)

func main() {
  r := gin.Default()

  // 기본 보안 헤더 사용
  r.Use(ginhelmet.Default())

  r.GET("/", func(c *gin.Context) {
    c.JSON(200, gin.H{"message": "Hello, World!"})
  })

  r.Run()
}
```
