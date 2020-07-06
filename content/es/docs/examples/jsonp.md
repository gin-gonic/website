---
title: "JSONP"
draft: false
---

Uso de JSONP para realizar una petición de datos desde un servidor en un dominio diferente
Using JSONP to request data from a server  in a different domain. Agregue un callback al cuerpo de respuesta si existe un callback del parámetro de consulta.

```go
func main() {
	r := gin.Default()

	r.GET("/JSONP?callback=x", func(c *gin.Context) {
		data := map[string]interface{}{
			"foo": "bar",
		}
		
		// el callback es x
		// Retorna  :   x({\"foo\":\"bar\"})
		c.JSONP(http.StatusOK, data)
	})

	// Escucha y sirve peticiones en 0.0.0.0:8080
	r.Run(":8080")
}
```
