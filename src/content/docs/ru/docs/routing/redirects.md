---
title: "Перенаправления"
sidebar:
  order: 9
---

Выполнить HTTP-перенаправление очень просто. Поддерживаются как внутренние, так и внешние адреса.

```go
router.GET("/test", func(c *gin.Context) {
  c.Redirect(http.StatusMovedPermanently, "http://www.google.com/")
})
```

Выполнение HTTP-перенаправления из POST. Ссылка на issue: [#444](https://github.com/gin-gonic/gin/issues/444)

```go
router.POST("/test", func(c *gin.Context) {
  c.Redirect(http.StatusFound, "/foo")
})
```

Выполнение перенаправления на уровне маршрутизатора с использованием `HandleContext`:

``` go
router.GET("/test", func(c *gin.Context) {
    c.Request.URL.Path = "/test2"
    router.HandleContext(c)
})
router.GET("/test2", func(c *gin.Context) {
    c.JSON(200, gin.H{"hello": "world"})
})
```
