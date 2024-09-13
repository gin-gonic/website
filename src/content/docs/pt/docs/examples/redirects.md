---
title: "Redirecionamentos"

---

Emitir um redirecionamento de HTTP é fácil. Ambas localizações internas e externas são suportadas:

```go
r.GET("/test", func(c *gin.Context) {
	c.Redirect(http.StatusMovedPermanently, "http://www.google.com/")
})
```

Emitir um redirecionamento de HTTP a partir do `POST`. Consulte o problema: [#444](https://github.com/gin-gonic/gin/issues/444):

```go
r.POST("/test", func(c *gin.Context) {
	c.Redirect(http.StatusFound, "/foo")
})
```

Emitir um redirecionamento de roteador, use `HandleContext` como abaixo:

``` go
r.GET("/test", func(c *gin.Context) {
    c.Request.URL.Path = "/test2"
    r.HandleContext(c)
})
r.GET("/test2", func(c *gin.Context) {
    c.JSON(200, gin.H{"hello": "world"})
})
```
