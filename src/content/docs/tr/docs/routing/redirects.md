---
title: "Yönlendirmeler"
sidebar:
  order: 9
---

HTTP yönlendirmesi yapmak kolaydır. Hem dahili hem de harici konumlar desteklenir.

```go
router.GET("/test", func(c *gin.Context) {
  c.Redirect(http.StatusMovedPermanently, "http://www.google.com/")
})
```

POST'tan HTTP yönlendirmesi yapma. Şu konuya bakın: [#444](https://github.com/gin-gonic/gin/issues/444)

```go
router.POST("/test", func(c *gin.Context) {
  c.Redirect(http.StatusFound, "/foo")
})
```

Yönlendirici yönlendirmesi yapmak için aşağıdaki gibi `HandleContext` kullanın.

``` go
router.GET("/test", func(c *gin.Context) {
    c.Request.URL.Path = "/test2"
    router.HandleContext(c)
})
router.GET("/test2", func(c *gin.Context) {
    c.JSON(200, gin.H{"hello": "world"})
})
```
