---
title: "AsciiJSON"
draft: false
---

Usando a `AsciiJSON` para gerar JSON de apenas ASCII com caracteres que não são ASCII escapados:

```go
func main() {
	r := gin.Default()

	r.GET("/someJSON", func(c *gin.Context) {
		data := map[string]interface{}{
			"lang": "GO语言",
			"tag":  "<br>",
		}

		// resultará em : {"lang":"GO\u8bed\u8a00","tag":"\u003cbr\u003e"}
		c.AsciiJSON(http.StatusOK, data)
	})

	// Ouvir e servir na 0.0.0.0:8080
	r.Run(":8080")
}
```
