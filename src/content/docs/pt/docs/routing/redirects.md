---
title: "Redirecionamentos"
sidebar:
  order: 9
---

Emitir um redirecionamento HTTP é fácil. Tanto localizações internas quanto externas são suportadas.

```go
router.GET("/test", func(c *gin.Context) {
  c.Redirect(http.StatusMovedPermanently, "http://www.google.com/")
})
```

Emitindo um redirecionamento HTTP a partir de POST. Consulte a issue: [#444](https://github.com/gin-gonic/gin/issues/444)

```go
router.POST("/test", func(c *gin.Context) {
  c.Redirect(http.StatusFound, "/foo")
})
```

Emitindo um redirecionamento no nível do roteador, use `HandleContext` como abaixo.

``` go
router.GET("/test", func(c *gin.Context) {
    c.Request.URL.Path = "/test2"
    router.HandleContext(c)
})
router.GET("/test2", func(c *gin.Context) {
    c.JSON(200, gin.H{"hello": "world"})
})
```
