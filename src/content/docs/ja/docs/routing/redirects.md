---
title: "リダイレクト"
sidebar:
  order: 9
---

HTTPリダイレクトの発行は簡単です。内部と外部の両方のロケーションがサポートされています。

```go
router.GET("/test", func(c *gin.Context) {
  c.Redirect(http.StatusMovedPermanently, "http://www.google.com/")
})
```

POSTからのHTTPリダイレクトの発行。Issue [#444](https://github.com/gin-gonic/gin/issues/444)を参照してください。

```go
router.POST("/test", func(c *gin.Context) {
  c.Redirect(http.StatusFound, "/foo")
})
```

ルーターリダイレクトの発行には、以下のように`HandleContext`を使用します。

``` go
router.GET("/test", func(c *gin.Context) {
    c.Request.URL.Path = "/test2"
    router.HandleContext(c)
})
router.GET("/test2", func(c *gin.Context) {
    c.JSON(200, gin.H{"hello": "world"})
})
```
