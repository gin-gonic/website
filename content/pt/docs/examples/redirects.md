---
title: "Redirecionamentos"
draft: false
---

Emitir um redirecionamento de HTTP é fácil. Ambas localizações internas e externas são suportadas:

```go
router.GET("/test", func(c *gin.Context) {
	c.Redirect(http.StatusMovedPermanently, "http://www.google.com/")
})
```

Emitir um redirecionamento de HTTP a partir do `POST`. Consulte o problema: [#444](https://github.com/gin-gonic/gin/issues/444):

```go
router.POST("/test", func(c *gin.Context) {
	c.Redirect(http.StatusFound, "/foo")
})
```

Emitir um redirecionamento de roteador, use `HandleContext` como abaixo:

``` go
router.GET("/test", func(c *gin.Context) {
    c.Request.URL.Path = "/test2"
    router.HandleContext(c)
})
router.GET("/test2", func(c *gin.Context) {
    c.JSON(200, gin.H{"hello": "world"})
})
```
