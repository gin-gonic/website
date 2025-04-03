---
title: "쿼리 문자열 파라미터"
draft: false
---

```go
func main() {
	router := gin.Default()

	// 쿼리 문자열 파라미터는 기존의 Request객체를 사용하여 분석 됩니다.
	// 이 URL과 일치하는 요청에 대해 응답합니다:  /welcome?firstname=Jane&lastname=Doe
	router.GET("/welcome", func(c *gin.Context) {
		firstname := c.DefaultQuery("firstname", "Guest")
		lastname := c.Query("lastname") // c.Request.URL.Query().Get("lastname")의 단축어

		c.String(http.StatusOK, "Hello %s %s", firstname, lastname)
	})
	router.Run(":8080")
}
```
