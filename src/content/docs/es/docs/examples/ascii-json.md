---
title: "AsciiJSON"
---

Uso de AsciiJSON para generar respuestas JSON únicamente con caracteres ASCII y escape de caracteres no-ASCII.

```go
func main() {
	router := gin.Default()

	router.GET("/someJSON", func(c *gin.Context) {
		data := map[string]interface{}{
			"lang": "GO语言",
			"tag":  "<br>",
		}

		// retornará : {"lang":"GO\u8bed\u8a00","tag":"\u003cbr\u003e"}
		c.AsciiJSON(http.StatusOK, data)
	})

	// Escucha y sirve peticiones en 0.0.0.0:8080
	router.Run(":8080")
}
```
