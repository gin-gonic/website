---
title: "쿠키"
sidebar:
  order: 7
---

Gin은 응답과 요청에서 HTTP 쿠키를 설정하고 읽는 헬퍼를 제공합니다.

### `SetCookie` 매개변수

`c.SetCookie()` 메서드 시그니처는 다음과 같습니다:

```go
c.SetCookie(name, value string, maxAge int, path, domain string, secure, httpOnly bool)
```

| 매개변수  | 설명 |
|------------|-------------|
| `name`     | 쿠키 이름 (키). |
| `value`    | 쿠키 값. |
| `maxAge`   | **초** 단위의 유효 시간. 쿠키를 삭제하려면 `-1`, 세션 쿠키(브라우저 닫을 때 삭제)로 만들려면 `0`으로 설정합니다. |
| `path`     | 쿠키가 유효한 URL 경로. 사이트 전체에서 사용하려면 `"/"`를 사용합니다. |
| `domain`   | 쿠키의 범위가 되는 도메인 (예: `"example.com"`). 개발 중에는 `"localhost"`를 사용합니다. |
| `secure`   | `true`이면 쿠키가 **HTTPS** 연결을 통해서만 전송됩니다. **프로덕션에서는 `true`로 설정하세요.** |
| `httpOnly` | `true`이면 클라이언트 측 JavaScript(`document.cookie`)에서 쿠키에 접근할 수 없어 XSS 공격을 방지하는 데 도움이 됩니다. **프로덕션에서는 `true`로 설정하세요.** |

:::tip[프로덕션 권장 사항]
프로덕션 배포에서는 CSRF(Cross-Site Request Forgery) 및 XSS(Cross-Site Scripting) 공격에 대한 노출을 최소화하기 위해 `Secure: true`, `HttpOnly: true`, `SameSite: Strict`(또는 `Lax`)를 설정하세요.
:::

### 쿠키 설정 및 가져오기

```go
import (
  "fmt"

  "github.com/gin-gonic/gin"
)

func main() {

  router := gin.Default()

  router.GET("/cookie", func(c *gin.Context) {

    cookie, err := c.Cookie("gin_cookie")

    if err != nil {
      cookie = "NotSet"
      c.SetCookie("gin_cookie", "test", 3600, "/", "localhost", false, true)
    }

    fmt.Printf("Cookie value: %s \n", cookie)
  })

  router.Run()
}
```

### 테스트해 보기

```bash
# 첫 번째 요청 -- 쿠키가 전송되지 않고, 서버가 설정합니다
curl -v http://localhost:8080/cookie
# 응답 헤더에서 "Set-Cookie: gin_cookie=test"를 확인합니다

# 두 번째 요청 -- 쿠키를 되돌려 보냅니다
curl -v --cookie "gin_cookie=test" http://localhost:8080/cookie
# 서버 로그: Cookie value: test
```

### 쿠키 삭제

max age를 `-1`로 설정하여 쿠키를 삭제합니다.

```go
c.SetCookie("gin_cookie", "test", -1, "/", "localhost", false, true)
```

### http.Cookie를 통한 쿠키 설정 (v1.11+)

Gin은 `*http.Cookie`를 사용한 쿠키 설정도 지원하여 `Expires`, `MaxAge`, `SameSite`, `Partitioned`와 같은 필드에 접근할 수 있습니다.

```go
import (
  "net/http"
  "time"
  "github.com/gin-gonic/gin"
)

func main() {
  r := gin.Default()
  r.GET("/set-cookie", func(c *gin.Context) {
    c.SetCookieData(&http.Cookie{
      Name:   "session_id",
      Value:  "abc123",
      Path:   "/",
      Domain:   "localhost",
      Expires:  time.Now().Add(24 * time.Hour),
      MaxAge:   86400,
      Secure:   true,
      HttpOnly: true,
      SameSite: http.SameSiteLaxMode,
      // Partitioned: true, // Go 1.22+
    })
    c.String(http.StatusOK, "ok")
  })
  r.Run(":8080")
}
```

## 참고

- [보안 헤더](/ko-kr/docs/middleware/security-headers/)
