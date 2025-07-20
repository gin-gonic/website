---
title: "重新導向"
---

發出 HTTP 重新導向很簡單。內部和外部位置都支援。

```go
import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.GET("/test", func(c *gin.Context) {
    c.Redirect(http.StatusMovedPermanently, "http://www.google.com/")
  })

  router.Run(":8080")
}
```

從 POST 發出 HTTP 重新導向。請參閱問題：[#444](https://github.com/gin-gonic/gin/issues/444)

```go
func main() {
  router := gin.Default()

  router.POST("/test", func(c *gin.Context) {
    c.Redirect(http.StatusFound, "/foo")
  })

  router.GET("/foo", func(c *gin.Context) {
    c.String(http.StatusOK, "foo")
  })

  router.Run(":8080")
}
```

若要發出路由器重新導向，請如下所示使用 `HandleContext`。

``` go
func main() {
  router := gin.Default()

  router.GET("/test", func(c *gin.Context) {
    c.Request.URL.Path = "/test2"
    router.HandleContext(c)
  })
  router.GET("/test2", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{"hello": "world"})
  })

  router.Run(":8080")
}
```
