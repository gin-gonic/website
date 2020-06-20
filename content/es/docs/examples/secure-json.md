---
title: "Uso de SecureJSON"
draft: false
---
Usando SecureJSON para evitar el secuestro de JSON. Por defecto se antepone `"while(1),"` al cuerpo de respuesta si la estructura dada son valores de array.

```go
func main() {
	r := gin.Default()

	// Se puede emplear un prefijo JSON seguro propio 
	// r.SecureJsonPrefix(")]}',\n")

	r.GET("/someJSON", func(c *gin.Context) {
		names := []string{"lena", "austin", "foo"}

		// Retornará  :   while(1);["lena","austin","foo"]
		c.SecureJSON(http.StatusOK, names)
	})

	r.Run(":8080")
}
```
