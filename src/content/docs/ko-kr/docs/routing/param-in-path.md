---
title: "경로의 매개변수"
sidebar:
  order: 2
---

```go
func main() {
  router := gin.Default()

  // 이 핸들러는 /user/john에 매칭되지만 /user/ 또는 /user에는 매칭되지 않습니다
  router.GET("/user/:name", func(c *gin.Context) {
    name := c.Param("name")
    c.String(http.StatusOK, "Hello %s", name)
  })

  // 하지만 이것은 /user/john/과 /user/john/send에도 매칭됩니다
  // /user/john에 매칭되는 다른 라우터가 없으면 /user/john/으로 리다이렉트됩니다
  router.GET("/user/:name/*action", func(c *gin.Context) {
    name := c.Param("name")
    action := c.Param("action")
    message := name + " is " + action
    c.String(http.StatusOK, message)
  })

  router.Run(":8080")
}
```

## 참고

- [쿼리 문자열 매개변수](/ko-kr/docs/routing/querystring-param/)
