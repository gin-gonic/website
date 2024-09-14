---
title: "PureJSON"

---

Normalmente, a JSON substitui os caracteres de HTML especiais com suas entidades de unicode, por exemplo, `<` torna-se `\u003c`. Se quiseres codificar tais caracteres literalmente, podes usar PureJSON. Esta funcionalidade está indisponível na Go 1.6 para baixo:

```go
func main() {
	r := gin.Default()
	
	// servir as entidades de unicode
	r.GET("/json", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"html": "<b>Hello, world!</b>",
		})
	})
	
	// servir os caracteres literais
	r.GET("/purejson", func(c *gin.Context) {
		c.PureJSON(200, gin.H{
			"html": "<b>Hello, world!</b>",
		})
	})
	
	// ouvir e servir no 0.0.0.0:8080
	r.Run(":8080")
}
```
