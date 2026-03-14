---
title: "Redirect"
sidebar:
  order: 9
---

Melakukan redirect HTTP sangat mudah. Baik lokasi internal maupun eksternal didukung.

```go
router.GET("/test", func(c *gin.Context) {
  c.Redirect(http.StatusMovedPermanently, "http://www.google.com/")
})
```

Melakukan redirect HTTP dari POST. Merujuk pada issue: [#444](https://github.com/gin-gonic/gin/issues/444)

```go
router.POST("/test", func(c *gin.Context) {
  c.Redirect(http.StatusFound, "/foo")
})
```

Melakukan redirect Router, gunakan `HandleContext` seperti di bawah ini.

``` go
router.GET("/test", func(c *gin.Context) {
    c.Request.URL.Path = "/test2"
    router.HandleContext(c)
})
router.GET("/test2", func(c *gin.Context) {
    c.JSON(200, gin.H{"hello": "world"})
})
```
