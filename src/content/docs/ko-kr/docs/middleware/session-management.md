---
title: "세션 관리"
sidebar:
  order: 9
---

세션을 사용하면 여러 HTTP 요청에 걸쳐 사용자별 데이터를 저장할 수 있습니다. HTTP는 무상태이므로, 세션은 쿠키나 다른 메커니즘을 사용하여 재방문 사용자를 식별하고 저장된 데이터를 가져옵니다.

## gin-contrib/sessions 사용하기

[gin-contrib/sessions](https://github.com/gin-contrib/sessions) 미들웨어는 여러 백엔드 저장소를 지원하는 세션 관리를 제공합니다:

```sh
go get github.com/gin-contrib/sessions
```

### 쿠키 기반 세션

가장 간단한 접근 방식으로 암호화된 쿠키에 세션 데이터를 저장합니다:

```go
package main

import (
  "net/http"

  "github.com/gin-contrib/sessions"
  "github.com/gin-contrib/sessions/cookie"
  "github.com/gin-gonic/gin"
)

func main() {
  r := gin.Default()

  // 시크릿 키로 쿠키 기반 세션 저장소 생성
  store := cookie.NewStore([]byte("your-secret-key"))
  r.Use(sessions.Sessions("mysession", store))

  r.GET("/login", func(c *gin.Context) {
    session := sessions.Default(c)
    session.Set("user", "john")
    session.Save()
    c.JSON(http.StatusOK, gin.H{"message": "logged in"})
  })

  r.GET("/profile", func(c *gin.Context) {
    session := sessions.Default(c)
    user := session.Get("user")
    if user == nil {
      c.JSON(http.StatusUnauthorized, gin.H{"error": "not logged in"})
      return
    }
    c.JSON(http.StatusOK, gin.H{"user": user})
  })

  r.GET("/logout", func(c *gin.Context) {
    session := sessions.Default(c)
    session.Clear()
    session.Save()
    c.JSON(http.StatusOK, gin.H{"message": "logged out"})
  })

  r.Run(":8080")
}
```

### Redis 기반 세션

프로덕션 애플리케이션의 경우, 여러 인스턴스 간 확장성을 위해 Redis에 세션을 저장합니다:

```go
package main

import (
  "net/http"

  "github.com/gin-contrib/sessions"
  "github.com/gin-contrib/sessions/redis"
  "github.com/gin-gonic/gin"
)

func main() {
  r := gin.Default()

  // 세션 저장을 위해 Redis에 연결
  store, err := redis.NewStore(10, "tcp", "localhost:6379", "", []byte("secret"))
  if err != nil {
    panic(err)
  }
  r.Use(sessions.Sessions("mysession", store))

  r.GET("/set", func(c *gin.Context) {
    session := sessions.Default(c)
    session.Set("count", 1)
    session.Save()
    c.JSON(http.StatusOK, gin.H{"count": 1})
  })

  r.GET("/get", func(c *gin.Context) {
    session := sessions.Default(c)
    count := session.Get("count")
    c.JSON(http.StatusOK, gin.H{"count": count})
  })

  r.Run(":8080")
}
```

## 세션 옵션

`sessions.Options`로 세션 동작을 설정합니다:

```go
session := sessions.Default(c)
session.Options(sessions.Options{
  Path:     "/",
  MaxAge:   3600,        // 세션이 1시간 후 만료 (초)
  HttpOnly: true,        // JavaScript 접근 방지
  Secure:   true,        // HTTPS를 통해서만 전송
  SameSite: http.SameSiteLaxMode,
})
```

| 옵션 | 설명 |
|--------|-------------|
| `Path` | 쿠키 경로 범위 (기본값: `/`) |
| `MaxAge` | 초 단위 수명. 삭제하려면 `-1`, 브라우저 세션은 `0` |
| `HttpOnly` | 쿠키에 대한 JavaScript 접근 방지 |
| `Secure` | HTTPS를 통해서만 쿠키 전송 |
| `SameSite` | 크로스 사이트 쿠키 동작 제어 (`Lax`, `Strict`, `None`) |

:::note
프로덕션에서는 항상 `HttpOnly: true`와 `Secure: true`를 설정하여 XSS 및 중간자 공격으로부터 세션 쿠키를 보호하세요.
:::

## 사용 가능한 백엔드

| 백엔드 | 패키지 | 사용 사례 |
|---------|---------|----------|
| Cookie | `sessions/cookie` | 간단한 앱, 작은 세션 데이터 |
| Redis | `sessions/redis` | 프로덕션, 다중 인스턴스 배포 |
| Memcached | `sessions/memcached` | 고성능 캐싱 계층 |
| MongoDB | `sessions/mongo` | MongoDB가 주 데이터스토어인 경우 |
| PostgreSQL | `sessions/postgres` | PostgreSQL이 주 데이터스토어인 경우 |

## 세션 vs JWT

| 측면 | 세션 | JWT |
|--------|----------|-----|
| 저장소 | 서버 측 (Redis, DB) | 클라이언트 측 (토큰) |
| 폐기 | 쉬움 (저장소에서 삭제) | 어려움 (차단 목록 필요) |
| 확장성 | 공유 저장소 필요 | 무상태 |
| 데이터 크기 | 서버 측 무제한 | 토큰 크기로 제한 |

쉬운 폐기가 필요할 때(예: 로그아웃, 사용자 차단) 세션을 사용하세요. 마이크로서비스 간 무상태 인증이 필요할 때 JWT를 사용하세요.

## 참고

- [쿠키 처리](/ko-kr/docs/server-config/cookie/)
- [보안 모범 사례](/ko-kr/docs/middleware/security-guide/)
- [미들웨어 사용하기](/ko-kr/docs/middleware/using-middleware/)
