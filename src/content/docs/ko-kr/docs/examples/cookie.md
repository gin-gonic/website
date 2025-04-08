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
