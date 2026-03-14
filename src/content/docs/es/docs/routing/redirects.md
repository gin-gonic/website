---
title: "Redirecciones"
sidebar:
  order: 9
---

Realizar una redirección HTTP es fácil. Se admiten tanto ubicaciones internas como externas.

```go
router.GET("/test", func(c *gin.Context) {
  c.Redirect(http.StatusMovedPermanently, "http://www.google.com/")
})
```

Realizar una redirección HTTP desde POST. Consulta el issue: [#444](https://github.com/gin-gonic/gin/issues/444)

```go
router.POST("/test", func(c *gin.Context) {
  c.Redirect(http.StatusFound, "/foo")
})
```

Realizar una redirección a nivel de enrutador, usa `HandleContext` como se muestra a continuación.

``` go
router.GET("/test", func(c *gin.Context) {
    c.Request.URL.Path = "/test2"
    router.HandleContext(c)
})
router.GET("/test2", func(c *gin.Context) {
    c.JSON(200, gin.H{"hello": "world"})
})
```
