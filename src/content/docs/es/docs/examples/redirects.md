---
title: "Redirección"
---

Emitir una redirección HTTP es sencillo. Son soportadas las rutas internas o externas.

```go
router.GET("/test", func(c *gin.Context) {
	c.Redirect(http.StatusMovedPermanently, "http://www.google.com/")
})
```

Emitir una redirección HTTP desde POST. Véase en el issue: [#444](https://github.com/gin-gonic/gin/issues/444)

```go
router.POST("/test", func(c *gin.Context) {
	c.Redirect(http.StatusFound, "/foo")
})
```

Emitir una redirección hacia un Router, puede emplearse `HandleContext` como en el ejemplo inferior.

``` go
router.GET("/test", func(c *gin.Context) {
    c.Request.URL.Path = "/test2"
    router.HandleContext(c)
})
router.GET("/test2", func(c *gin.Context) {
    c.JSON(200, gin.H{"hello": "world"})
})
```
