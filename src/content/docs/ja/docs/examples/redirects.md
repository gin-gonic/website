---
title: "リダイレクト"
---

HTTP リダイレクトするのは簡単です。内部パス、外部URL両方のリダイレクトに対応しています。

```go
router.GET("/test", func(c *gin.Context) {
  c.Redirect(http.StatusMovedPermanently, "http://www.google.com/")
})
```

POSTからのHTTPリダイレクトのissueは [#444](https://github.com/gin-gonic/gin/issues/444) を参照してください。

```go
router.POST("/test", func(c *gin.Context) {
  c.Redirect(http.StatusFound, "/foo")
})
```

Router でリダイレクトするには、下記のように `HandleContext` メソッドを使ってください。

``` go
router.GET("/test", func(c *gin.Context) {
    c.Request.URL.Path = "/test2"
    router.HandleContext(c)
})
router.GET("/test2", func(c *gin.Context) {
    c.JSON(200, gin.H{"hello": "world"})
})
```



