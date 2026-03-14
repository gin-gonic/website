---
title: "보안 모범 사례"
sidebar:
  order: 8
---

웹 애플리케이션은 공격자의 주요 대상입니다. 사용자 입력을 처리하거나, 데이터를 저장하거나, 리버스 프록시 뒤에서 실행되는 Gin 애플리케이션은 프로덕션에 배포하기 전에 의도적인 보안 설정이 필요합니다. 이 가이드에서는 가장 중요한 방어 수단을 다루고 Gin 미들웨어와 표준 Go 라이브러리를 사용하여 각각을 적용하는 방법을 보여줍니다.

:::note
보안은 계층적입니다. 이 목록의 단일 기술만으로는 충분하지 않습니다. 심층 방어를 구축하기 위해 관련된 모든 섹션을 적용하세요.
:::

## CORS 설정

CORS(Cross-Origin Resource Sharing)는 어떤 외부 도메인이 API에 요청할 수 있는지 제어합니다. 잘못 설정된 CORS는 악성 웹사이트가 인증된 사용자를 대신하여 서버의 응답을 읽을 수 있게 합니다.

잘 테스트된 솔루션을 위해 [`gin-contrib/cors`](https://github.com/gin-contrib/cors) 패키지를 사용하세요.

```go
package main

import (
  "time"

  "github.com/gin-contrib/cors"
  "github.com/gin-gonic/gin"
)

func main() {
  r := gin.Default()

  r.Use(cors.New(cors.Config{
    AllowOrigins:     []string{"https://example.com"},
    AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
    AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
    ExposeHeaders:    []string{"Content-Length"},
    AllowCredentials: true,
    MaxAge:           12 * time.Hour,
  }))

  r.GET("/api/data", func(c *gin.Context) {
    c.JSON(200, gin.H{"message": "ok"})
  })

  r.Run()
}
```

:::note
`AllowOrigins: []string{"*"}`와 `AllowCredentials: true`를 함께 사용하지 마세요. 이는 모든 사이트가 API에 인증된 요청을 할 수 있다고 브라우저에 알려줍니다.
:::

## CSRF 보호

CSRF(Cross-Site Request Forgery)는 인증된 사용자의 브라우저를 속여 애플리케이션에 원하지 않는 요청을 보내도록 합니다. 인증을 위해 쿠키에 의존하는 모든 상태 변경 엔드포인트(POST, PUT, DELETE)는 CSRF 보호가 필요합니다.

토큰 기반 보호를 추가하려면 [`gin-contrib/csrf`](https://github.com/gin-contrib/csrf) 미들웨어를 사용하세요.

```go
package main

import (
  "github.com/gin-contrib/csrf"
  "github.com/gin-contrib/sessions"
  "github.com/gin-contrib/sessions/cookie"
  "github.com/gin-gonic/gin"
)

func main() {
  r := gin.Default()

  store := cookie.NewStore([]byte("session-secret"))
  r.Use(sessions.Sessions("mysession", store))

  r.Use(csrf.Middleware(csrf.Options{
    Secret: "csrf-token-secret",
    ErrorFunc: func(c *gin.Context) {
      c.String(403, "CSRF token mismatch")
      c.Abort()
    },
  }))

  r.GET("/form", func(c *gin.Context) {
    token := csrf.GetToken(c)
    c.JSON(200, gin.H{"csrf_token": token})
  })

  r.POST("/form", func(c *gin.Context) {
    c.JSON(200, gin.H{"message": "submitted"})
  })

  r.Run()
}
```

:::note
CSRF 보호는 쿠키 기반 인증을 사용하는 애플리케이션에 중요합니다. `Authorization` 헤더(예: Bearer 토큰)에만 의존하는 API는 브라우저가 해당 헤더를 자동으로 부착하지 않으므로 CSRF에 취약하지 않습니다.
:::

## 속도 제한

속도 제한은 남용, 무차별 대입 공격 및 리소스 고갈을 방지합니다. 표준 라이브러리의 `golang.org/x/time/rate` 패키지를 사용하여 간단한 클라이언트별 속도 제한기를 미들웨어로 구축할 수 있습니다.

```go
package main

import (
  "net/http"
  "sync"

  "github.com/gin-gonic/gin"
  "golang.org/x/time/rate"
)

func RateLimiter() gin.HandlerFunc {
  type client struct {
    limiter *rate.Limiter
  }

  var (
    mu      sync.Mutex
    clients = make(map[string]*client)
  )

  return func(c *gin.Context) {
    ip := c.ClientIP()

    mu.Lock()
    if _, exists := clients[ip]; !exists {
      // 초당 10개 요청 허용, 버스트 20
      clients[ip] = &client{limiter: rate.NewLimiter(10, 20)}
    }
    cl := clients[ip]
    mu.Unlock()

    if !cl.limiter.Allow() {
      c.AbortWithStatusJSON(http.StatusTooManyRequests, gin.H{
        "error": "rate limit exceeded",
      })
      return
    }

    c.Next()
  }
}

func main() {
  r := gin.Default()
  r.Use(RateLimiter())

  r.GET("/api/resource", func(c *gin.Context) {
    c.JSON(200, gin.H{"message": "ok"})
  })

  r.Run()
}
```

:::note
위 예제는 인메모리 맵에 제한기를 저장합니다. 프로덕션에서는 오래된 항목의 주기적 정리를 추가하고, 여러 애플리케이션 인스턴스를 실행하는 경우 분산 속도 제한기(예: Redis 지원)를 고려해야 합니다.
:::

## 입력 유효성 검사 및 SQL 인젝션 방지

항상 구조체 태그와 함께 Gin의 모델 바인딩을 사용하여 입력을 검증하고 바인딩합니다. 사용자 입력을 연결하여 SQL 쿼리를 구성하지 마세요.

### 구조체 태그로 입력 검증

```go
type CreateUser struct {
  Username string `json:"username" binding:"required,alphanum,min=3,max=30"`
  Email    string `json:"email"    binding:"required,email"`
  Age      int    `json:"age"      binding:"required,gte=1,lte=130"`
}

func createUserHandler(c *gin.Context) {
  var req CreateUser
  if err := c.ShouldBindJSON(&req); err != nil {
    c.JSON(400, gin.H{"error": err.Error()})
    return
  }
  // req는 이제 검증되었습니다; 안전하게 진행합니다
}
```

### 매개변수화된 쿼리 사용

```go
// 위험 -- SQL 인젝션 취약점
row := db.QueryRow("SELECT id FROM users WHERE username = '" + username + "'")

// 안전 -- 매개변수화된 쿼리
row := db.QueryRow("SELECT id FROM users WHERE username = $1", username)
```

이는 모든 데이터베이스 라이브러리에 적용됩니다. `database/sql`, GORM, sqlx 또는 다른 ORM을 사용하든, 항상 매개변수 플레이스홀더를 사용하고 문자열 연결은 절대 사용하지 마세요.

:::note
입력 유효성 검사와 매개변수화된 쿼리는 인젝션 공격에 대한 가장 중요한 두 가지 방어 수단입니다. 어느 하나만으로는 충분하지 않습니다 -- 둘 다 사용하세요.
:::

## XSS 방지

XSS(Cross-Site Scripting)는 공격자가 다른 사용자의 브라우저에서 실행되는 악성 스크립트를 주입할 때 발생합니다. 여러 계층에서 이를 방어하세요.

### HTML 출력 이스케이프

HTML 템플릿을 렌더링할 때 Go의 `html/template` 패키지는 기본적으로 출력을 이스케이프합니다. 사용자 제공 데이터를 JSON으로 반환하는 경우, 브라우저가 JSON을 HTML로 해석하지 않도록 `Content-Type` 헤더가 올바르게 설정되어 있는지 확인하세요.

```go
// Gin은 JSON 응답의 Content-Type을 자동으로 설정합니다.
// 구조화된 데이터를 반환할 때 c.String이 아닌 c.JSON을 사용하세요.
c.JSON(200, gin.H{"input": userInput})
```

### JSONP 보호를 위한 SecureJSON 사용

Gin은 JSON 하이재킹을 방지하기 위해 `while(1);`을 앞에 추가하는 `c.SecureJSON`을 제공합니다.

```go
c.SecureJSON(200, gin.H{"data": userInput})
```

### 필요 시 Content-Type 명시적 설정

```go
// API 엔드포인트의 경우, 항상 JSON을 반환
c.Header("Content-Type", "application/json; charset=utf-8")
c.Header("X-Content-Type-Options", "nosniff")
```

`X-Content-Type-Options: nosniff` 헤더는 브라우저의 MIME 타입 스니핑을 방지하여 서버가 다른 것으로 선언한 응답을 HTML로 해석하는 것을 중지합니다.

## 보안 헤더 미들웨어

보안 헤더를 추가하는 것은 가장 간단하고 효과적인 강화 단계 중 하나입니다. 자세한 예제는 [보안 헤더](/ko-kr/docs/middleware/security-headers/) 전체 페이지를 참조하세요. 아래는 필수 헤더의 간단한 요약입니다.

```go
func SecurityHeaders() gin.HandlerFunc {
  return func(c *gin.Context) {
    c.Header("X-Frame-Options", "DENY")
    c.Header("X-Content-Type-Options", "nosniff")
    c.Header("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
    c.Header("Content-Security-Policy", "default-src 'self'")
    c.Header("Referrer-Policy", "strict-origin")
    c.Header("Permissions-Policy", "geolocation=(), camera=(), microphone=()")
    c.Next()
  }
}
```

| 헤더 | 방지하는 것 |
|--------|-----------------|
| `X-Frame-Options: DENY` | iframe을 통한 클릭재킹 |
| `X-Content-Type-Options: nosniff` | MIME 타입 스니핑 공격 |
| `Strict-Transport-Security` | 프로토콜 다운그레이드 및 쿠키 하이재킹 |
| `Content-Security-Policy` | XSS 및 데이터 인젝션 |
| `Referrer-Policy` | 민감한 URL 매개변수의 타사 유출 |
| `Permissions-Policy` | 브라우저 API의 무단 사용 (카메라, 마이크 등) |

## 신뢰할 수 있는 프록시

애플리케이션이 리버스 프록시나 로드 밸런서 뒤에서 실행되는 경우, Gin에 어떤 프록시를 신뢰할지 알려야 합니다. 이 설정 없이는 공격자가 `X-Forwarded-For` 헤더를 위조하여 IP 기반 접근 제어와 속도 제한을 우회할 수 있습니다.

```go
// 알려진 프록시 주소만 신뢰
router.SetTrustedProxies([]string{"10.0.0.1", "192.168.1.0/24"})
```

전체 설명과 설정 옵션은 [신뢰할 수 있는 프록시](/ko-kr/docs/server-config/trusted-proxies/) 페이지를 참조하세요.

## HTTPS 및 TLS

모든 프로덕션 Gin 애플리케이션은 HTTPS를 통해 트래픽을 서빙해야 합니다. Gin은 Let's Encrypt를 통한 자동 TLS 인증서를 지원합니다.

```go
import "github.com/gin-gonic/autotls"

func main() {
  r := gin.Default()
  // ... 라우트 ...
  log.Fatal(autotls.Run(r, "example.com"))
}
```

커스텀 인증서 관리자를 포함한 완전한 설정 지침은 [Let's Encrypt 지원](/ko-kr/docs/server-config/support-lets-encrypt/) 페이지를 참조하세요.

:::note
프로토콜 다운그레이드 공격을 방지하기 위해 항상 HTTPS를 `Strict-Transport-Security` 헤더(HSTS)와 함께 사용하세요. HSTS 헤더가 설정되면 브라우저는 일반 HTTP를 통한 연결을 거부합니다.
:::

## 참고

- [보안 헤더](/ko-kr/docs/middleware/security-headers/)
- [신뢰할 수 있는 프록시](/ko-kr/docs/server-config/trusted-proxies/)
- [Let's Encrypt 지원](/ko-kr/docs/server-config/support-lets-encrypt/)
- [커스텀 미들웨어](/ko-kr/docs/middleware/custom-middleware/)
- [바인딩 및 유효성 검사](/ko-kr/docs/binding/binding-and-validation/)
