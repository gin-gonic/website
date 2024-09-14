---
title: "SecureJSON"

---

Usando SecureJSON para impedir o sequestro do JSON. Por padrão adiciona `"while(1)"` no início do corpo da resposta se a dada estrutura for valores de arranjo:

```go
func main() {
	r := gin.Default()

	// podes também usar o teu próprio prefixo de JSON seguro
	// r.SecureJsonPrefix(")]}',\n")

	r.GET("/someJSON", func(c *gin.Context) {
		names := []string{"lena", "austin", "foo"}

		// resultará em: while(1);["lena","austin","foo"]
		c.SecureJSON(http.StatusOK, names)
	})

	// ouvir e servir no 0.0.0.0:8080
	r.Run(":8080")
}
```
