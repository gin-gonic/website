---
title: "Ümbersuunamised"
draft: false
---

HTTP ümbersuunamise väljastamine on lihtne. Toetatud on nii sisemised kui ka välised asukohad.

```go
r.GET("/test", func(c *gin.Context) {
	c.Redirect(http.StatusMovedPermanently, "http://www.google.com/")
})
```

HTTP ümbersuunamise väljastamine POST-ist. Vaadake teemat: [#444](https://github.com/gin-gonic/gin/issues/444)

```go
r.POST("/test", func(c *gin.Context) {
	c.Redirect(http.StatusFound, "/foo")
})
```

Ruuteri ümbersuunamise väljastamiseks, kasutage `HandleContext` nagu all pool toodud.

``` go
r.GET("/test", func(c *gin.Context) {
    c.Request.URL.Path = "/test2"
    r.HandleContext(c)
})
r.GET("/test2", func(c *gin.Context) {
    c.JSON(200, gin.H{"hello": "world"})
})
```
