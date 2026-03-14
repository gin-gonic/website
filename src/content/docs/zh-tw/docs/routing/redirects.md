---
title: "重新導向"
sidebar:
  order: 9
---

發送 HTTP 重新導向非常簡單，支援內部和外部位址。

```go
router.GET("/test", func(c *gin.Context) {
  c.Redirect(http.StatusMovedPermanently, "http://www.google.com/")
})
```

從 POST 發送 HTTP 重新導向。參考 issue：[#444](https://github.com/gin-gonic/gin/issues/444)

```go
router.POST("/test", func(c *gin.Context) {
  c.Redirect(http.StatusFound, "/foo")
})
```

發送路由器重新導向，使用 `HandleContext`，如下所示。

``` go
router.GET("/test", func(c *gin.Context) {
    c.Request.URL.Path = "/test2"
    router.HandleContext(c)
})
router.GET("/test2", func(c *gin.Context) {
    c.JSON(200, gin.H{"hello": "world"})
})
```
