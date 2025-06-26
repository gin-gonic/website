---
title: "Intermediário Personalizado"
---

```go
func Logger() gin.HandlerFunc {
	return func(c *gin.Context) {
		t := time.Now()

		// Definir a variável de exemplo
		c.Set("example", "12345")

		// antes da requisição

		c.Next()

		// depois da requisição
		latency := time.Since(t)
		log.Print(latency)

		// acessar o estado que estamos a enviar
		status := c.Writer.Status()
		log.Println(status)
	}
}

func main() {
	r := gin.New()
	r.Use(Logger())

	r.GET("/test", func(c *gin.Context) {
		example := c.MustGet("example").(string)

		// imprimiria: "12345"
		log.Println(example)
	})

	// Ouvir e servir na 0.0.0.0:8080
	router.Run(":8080")
}
```

