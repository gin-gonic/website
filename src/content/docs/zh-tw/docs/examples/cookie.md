---
title: "Cookie"
---

設定和取得 cookie。

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

      fmt.Printf("Cookie 值：%s \n", cookie)
  })

  router.Run()
}
```

將 max age 設定為 -1 來刪除 cookie。

```go
c.SetCookie("gin_cookie", "test", -1, "/", "localhost", false, true)
```
