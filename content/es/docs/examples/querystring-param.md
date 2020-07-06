---
title: "Parámetros GET en URL"
draft: false
---

```go
func main() {
	router := gin.Default()

	// Los parámetros son interpretados usando el objeto de peticiones existente.
	// La petición responde a un url que coincide con: /welcome?firstname=Jane&lastname=Doe
	router.GET("/welcome", func(c *gin.Context) {
		firstname := c.DefaultQuery("firstname", "Guest")
		lastname := c.Query("lastname") // método abreviado para c.Request.URL.Query().Get("lastname")

		c.String(http.StatusOK, "Hello %s %s", firstname, lastname)
	})
	router.Run(":8080")
}
```
