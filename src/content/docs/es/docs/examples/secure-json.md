---
title: "Uso de SecureJSON"

---
Usando SecureJSON para evitar el secuestro de JSON. Por defecto se antepone `"while(1),"` al cuerpo de respuesta si la estructura dada son valores de array.

```go
func main() {
	router := gin.Default()

	// Se puede emplear un prefijo JSON seguro propio 
	// router.SecureJsonPrefix(")]}',\n")

	router.GET("/someJSON", func(c *gin.Context) {
		names := []string{"lena", "austin", "foo"}

		// Retornará  :   while(1);["lena","austin","foo"]
		c.SecureJSON(http.StatusOK, names)
	})

	router.Run(":8080")
}
```
