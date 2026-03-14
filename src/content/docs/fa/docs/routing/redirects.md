---
title: "تغییر مسیرها"
sidebar:
  order: 9
---

صدور یک تغییر مسیر HTTP آسان است. هر دو مکان‌های داخلی و خارجی پشتیبانی می‌شوند.

```go
router.GET("/test", func(c *gin.Context) {
  c.Redirect(http.StatusMovedPermanently, "http://www.google.com/")
})
```

صدور یک تغییر مسیر HTTP از POST. به issue مراجعه کنید: [#444](https://github.com/gin-gonic/gin/issues/444)

```go
router.POST("/test", func(c *gin.Context) {
  c.Redirect(http.StatusFound, "/foo")
})
```

صدور یک تغییر مسیر روتر، از `HandleContext` مانند زیر استفاده کنید.

``` go
router.GET("/test", func(c *gin.Context) {
    c.Request.URL.Path = "/test2"
    router.HandleContext(c)
})
router.GET("/test2", func(c *gin.Context) {
    c.JSON(200, gin.H{"hello": "world"})
})
```
