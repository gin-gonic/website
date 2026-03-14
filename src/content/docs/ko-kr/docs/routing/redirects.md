---
title: "리다이렉트"
sidebar:
  order: 9
---

HTTP 리다이렉트를 발행하는 것은 간단합니다. 내부 및 외부 위치 모두 지원됩니다.

```go
router.GET("/test", func(c *gin.Context) {
  c.Redirect(http.StatusMovedPermanently, "http://www.google.com/")
})
```

POST에서 HTTP 리다이렉트를 발행합니다. 이슈 참조: [#444](https://github.com/gin-gonic/gin/issues/444)

```go
router.POST("/test", func(c *gin.Context) {
  c.Redirect(http.StatusFound, "/foo")
})
```

라우터 리다이렉트를 발행하려면, 아래와 같이 `HandleContext`를 사용하세요.

``` go
router.GET("/test", func(c *gin.Context) {
    c.Request.URL.Path = "/test2"
    router.HandleContext(c)
})
router.GET("/test2", func(c *gin.Context) {
    c.JSON(200, gin.H{"hello": "world"})
})
```
