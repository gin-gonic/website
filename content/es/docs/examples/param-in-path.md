---
title: "Parámetros en rutas"
draft: false
---

```go
func main() {
	router := gin.Default()

	// El manejo de esta ruta aceptará valores como /user/john pero no manejará rutas como /user/ o /user
	router.GET("/user/:name", func(c *gin.Context) {
		name := c.Param("name")
		c.String(http.StatusOK, "Hello %s", name)
	})

	// Sin embargo, en este caso si podrá manejar rutas como /user/john/ e inclusive /user/john/send
	// Si no hay otra ruta que coincida con /user/john, será redireccionada hacia /user/john/
	router.GET("/user/:name/*action", func(c *gin.Context) {
		name := c.Param("name")
		action := c.Param("action")
		message := name + " is " + action
		c.String(http.StatusOK, message)
	})

	router.Run(":8080")
}
```
