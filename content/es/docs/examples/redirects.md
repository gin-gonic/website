---
title: "Redirección"
draft: false
---

Emitir una redirección HTTP es sencillo. Son soportadas las rutas internas o externas.

```go
r.GET("/test", func(c *gin.Context) {
	c.Redirect(http.StatusMovedPermanently, "http://www.google.com/")
})
```

Emitir una redirección HTTP desde POST. Véase en el issue: [#444](https://github.com/gin-gonic/gin/issues/444)

```go
r.POST("/test", func(c *gin.Context) {
	c.Redirect(http.StatusFound, "/foo")
})
```

Emitir una redirección hacia un Router, puede emplearse `HandleContext` como en el ejemplo inferior.

``` go
r.GET("/test", func(c *gin.Context) {
    c.Request.URL.Path = "/test2"
    r.HandleContext(c)
})
r.GET("/test2", func(c *gin.Context) {
    c.JSON(200, gin.H{"hello": "world"})
})
```
