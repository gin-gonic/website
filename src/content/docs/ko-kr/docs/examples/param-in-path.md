---
title: "경로를 포함한 파라미터"
draft: false
---

```go
func main() {
	router := gin.Default()

	// 이 핸들러는 /user/john와 매칭되지만 /user/ 또는 /user와는 매칭되지 않습니다.
	router.GET("/user/:name", func(c *gin.Context) {
		name := c.Param("name")
		c.String(http.StatusOK, "Hello %s", name)
	})

	// 하지만, 이것은 /user/john/ 뿐만 아니라 /user/john/send와도 매칭됩니다.
	// /user/john와 매칭되는 라우터가 없다면, /user/john/로 리다이렉트 됩니다.
	router.GET("/user/:name/*action", func(c *gin.Context) {
		name := c.Param("name")
		action := c.Param("action")
		message := name + " is " + action
		c.String(http.StatusOK, message)
	})

	router.Run(":8080")
}
```
