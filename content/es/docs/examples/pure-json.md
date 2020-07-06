---
title: "PureJSON"
draft: false
---
Usualmente, JSON sustituye carácteres especiales HTML con sus entidades unicode. Por ejemplo `<` se convierte a `\u003c`. Si se requiere condificar este tipo de caracteres literalmente, se puede utilizar PureJSON.
Esta característica no está disponible en Go 1.6 o versiones inferiores.

```go
func main() {
	r := gin.Default()
	
	// Sirve entidades unicode
	r.GET("/json", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"html": "<b>Hello, world!</b>",
		})
	})
	
	// Sirve carácteres literales
	r.GET("/purejson", func(c *gin.Context) {
		c.PureJSON(200, gin.H{
			"html": "<b>Hello, world!</b>",
		})
	})
	
	// Escucha y sirve peticiones en 0.0.0.0:8080
	r.Run(":8080")
}
```

Utilizando `curl` tenemos:
```
curl http://localhost:8080/purejson
{"html":"<b>Hello, world!</b>"}

curl http://localhost:8080/json
{"html":"\u003cb\u003eHello, world!\u003c/b\u003e"}%
```