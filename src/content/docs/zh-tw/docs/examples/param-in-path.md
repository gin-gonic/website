---
title: "路徑中的參數"
---

```go
func main() {
	router := gin.Default()

	// 此處理函式將比對 /user/john，但不會比對 /user/ 或 /user
	router.GET("/user/:name", func(c *gin.Context) {
		name := c.Param("name")
		c.String(http.StatusOK, "哈囉 %s", name)
	})

	// 然而，此處理函式將比對 /user/john/ 以及 /user/john/send
	// 如果沒有其他路由器比對 /user/john，它將重新導向到 /user/john/
	router.GET("/user/:name/*action", func(c *gin.Context) {
		name := c.Param("name")
		action := c.Param("action")
		message := name + " 正在 " + action
		c.String(http.StatusOK, message)
	})

	router.Run(":8080")
}
```
