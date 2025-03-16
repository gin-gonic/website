---
Заголовок: "Перенаправления"
черновик: false
---

Создать HTTP-перенаправление очень просто. Поддерживаются как внутренние, так и внешние расположения.

```go
r.GET("/test", func(c *gin.Context) {
	c.Redirect(http.StatusMovedPermanently, "http://www.google.com/")
})
```

Выдача HTTP-перенаправления из POST. См. выпуск: [#444](https://github.com/gin-gonic/gin/issues/444)

```go
r.POST("/test", func(c *gin.Context) {
	c.Redirect(http.StatusFound, "/foo")
})
```

Выдавая перенаправление Router, используйте `HandleContext`, как показано ниже.

``` go
r.GET("/test", func(c *gin.Context) {
    c.Request.URL.Path = "/test2"
    r.HandleContext(c)
})
r.GET("/test2", func(c *gin.Context) {
    c.JSON(200, gin.H{"hello": "world"})
})
```
