---
title: "Parâmetros no Caminho"
draft: false
---

```go
func main() {
	router := gin.Default()

	// este manipulador corresponderá ao "/user/john"
	// mas não corresponderá ao "/user/" ou ao "/user"
	router.GET("/user/:name", func(c *gin.Context) {
		name := c.Param("name")
		c.String(http.StatusOK, "Hello %s", name)
	})

	// no entanto, este corresponderá o "/user/john/"
	// e também "/user/john/send"
	// se nenhuma outra rota corresponder ao "/user/john",
	// redirecionará ao "/user/john"
	router.GET("/user/:name/*action", func(c *gin.Context) {
		name := c.Param("name")
		action := c.Param("action")
		message := name + " is " + action
		c.String(http.StatusOK, message)
	})

	router.Run(":8080")
}
```
