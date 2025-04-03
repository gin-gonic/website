---
title: "Redirects"

---

Issuing a HTTP redirect is easy. Both internal and external locations are supported.

```go
router.GET("/test", func(c *gin.Context) {
	c.Redirect(http.StatusMovedPermanently, "http://www.google.com/")
})
```

Issuing a HTTP redirect from POST. Refer to issue: [#444](https://github.com/gin-gonic/gin/issues/444)

```go
router.POST("/test", func(c *gin.Context) {
	c.Redirect(http.StatusFound, "/foo")
})
```

Issuing a Router redirect, use `HandleContext` like below.

``` go
router.GET("/test", func(c *gin.Context) {
    c.Request.URL.Path = "/test2"
    router.HandleContext(c)
})
router.GET("/test2", func(c *gin.Context) {
    c.JSON(200, gin.H{"hello": "world"})
})
```
