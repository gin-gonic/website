---
title: "리디렉션"
---

HTTP 리다이렉트 하는 것은 간단합니다. 내부와 외부위치를 모두 지원합니다.

```go
router.GET("/test", func(c *gin.Context) {
  c.Redirect(http.StatusMovedPermanently, "http://www.google.com/")
})
```

POST 요청에서 HTTP 리다이렉트를 수행하기 – 관련 이슈: [#444](https://github.com/gin-gonic/gin/issues/444) 참고

```go
router.POST("/test", func(c *gin.Context) {
  c.Redirect(http.StatusFound, "/foo")
})
```

라우터 리다이렉트를 실행하려면, 아래와 같이 `HandleContext`를 사용하세요.

``` go
router.GET("/test", func(c *gin.Context) {
    c.Request.URL.Path = "/test2"
    router.HandleContext(c)
})
router.GET("/test2", func(c *gin.Context) {
    c.JSON(200, gin.H{"hello": "world"})
})
```
