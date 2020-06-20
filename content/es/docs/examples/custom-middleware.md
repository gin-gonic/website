---
title: "Personalizar un Middleware"
draft: false
---

```go
func Logger() gin.HandlerFunc {
	return func(c *gin.Context) {
		t := time.Now()

		// Establecer el valor de la variable example
		c.Set("example", "12345")

		// antes de la petición

		c.Next()

		// después de la petición
		latency := time.Since(t)
		log.Print(latency)

		// acceso al estatus que se está enviando
		status := c.Writer.Status()
		log.Println(status)
	}
}

func main() {
	r := gin.New()
	r.Use(Logger())

	r.GET("/test", func(c *gin.Context) {
		example := c.MustGet("example").(string)

		// debe retornar: "12345"
		log.Println(example)
	})

	// Escucha y sirve peticiones en 0.0.0.0:8080
	r.Run(":8080")
}
```

