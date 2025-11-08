---
title: "Parameter di path"
---

```go
func main() {
  router := gin.Default()

  // Handler ini akan cocok dengan /user/john tetapi tidak akan cocok dengan /user/ atau /user
  router.GET("/user/:name", func(c *gin.Context) {
    name := c.Param("name")
    c.String(http.StatusOK, "Hello %s", name)
  })

  // Namun, yang ini akan cocok dengan /user/john/ dan juga /user/john/send
  // Jika tidak ada router lain yang cocok dengan /user/john, maka akan diarahkan ke /user/john/
  router.GET("/user/:name/*action", func(c *gin.Context) {
    name := c.Param("name")
    action := c.Param("action")
    message := name + " is " + action
    c.String(http.StatusOK, message)
  })

  router.Run(":8080")
}
```
