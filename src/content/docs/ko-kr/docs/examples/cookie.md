---
title: "Cookie"
---

쿠키의 설정 및 가져오기

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

max age를 -1로 설정하여 쿠키를 삭제합니다.

```go
c.SetCookie("gin_cookie", "test", -1, "/", "localhost", false, true)
```

### http.Cookie를 통한 쿠키 설정 (v1.11+)

Gin은 `*http.Cookie`를 사용한 쿠키 설정도 지원하며, `Expires`, `MaxAge`, `SameSite`, `Partitioned` 등의 필드에 접근할 수 있습니다.

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
