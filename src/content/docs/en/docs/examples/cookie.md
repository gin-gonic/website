---
title: "Cookie"
---

Set and get cookie.

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

Delete cookie by set max age to -1.

```go
c.SetCookie("gin_cookie", "test", -1, "/", "localhost", false, true)
```

### Set cookie via http.Cookie (v1.11+)

Gin also supports setting cookies using an `*http.Cookie`, giving access to fields like `Expires`, `MaxAge`, `SameSite`, and `Partitioned`.

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
            Name:     "session_id",
            Value:    "abc123",
            Path:     "/",
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
