---
title: "إعادة التوجيه"
sidebar:
  order: 9
---

إصدار إعادة توجيه HTTP أمر سهل. يتم دعم كل من المواقع الداخلية والخارجية.

```go
router.GET("/test", func(c *gin.Context) {
  c.Redirect(http.StatusMovedPermanently, "http://www.google.com/")
})
```

إصدار إعادة توجيه HTTP من POST. راجع المشكلة: [#444](https://github.com/gin-gonic/gin/issues/444)

```go
router.POST("/test", func(c *gin.Context) {
  c.Redirect(http.StatusFound, "/foo")
})
```

إصدار إعادة توجيه على مستوى الموجّه، استخدم `HandleContext` كما هو موضح أدناه.

``` go
router.GET("/test", func(c *gin.Context) {
    c.Request.URL.Path = "/test2"
    router.HandleContext(c)
})
router.GET("/test2", func(c *gin.Context) {
    c.JSON(200, gin.H{"hello": "world"})
})
```
