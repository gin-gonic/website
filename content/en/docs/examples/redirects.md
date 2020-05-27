---
title: "Redirects"
draft: false
---

Issuing a HTTP redirect is easy. Both internal and external locations are supported.

```go
r.GET("/test", func(c *gin.Context) {
	c.Redirect(http.StatusMovedPermanently, "http://www.google.com/")
})
```

Issuing a HTTP redirect from POST. Refer to issue: [#444](https://github.com/gin-gonic/gin/issues/444)

```go
r.POST("/test", func(c *gin.Context) {
	c.Redirect(http.StatusFound, "/foo")
})
```

Issuing a Router redirect, use `HandleContext` like below.

``` go
r.GET("/test", func(c *gin.Context) {
    c.Request.URL.Path = "/test2"
    r.HandleContext(c)
})
r.GET("/test2", func(c *gin.Context) {
    c.JSON(200, gin.H{"hello": "world"})
})
```
