---
title: "Custom Middleware"
---

```go
func Logger() gin.HandlerFunc {
	return func(c *gin.Context) {
		t := time.Now()

		// Atur variabel example
		c.Set("example", "12345")

		// sebelum permintaan

		c.Next()

		// setelah permintaan
		latency := time.Since(t)
		log.Print(latency)

		// akses status yang sedang kita kirim
		status := c.Writer.Status()
		log.Println(status)
	}
}

func main() {
	r := gin.New()
	r.Use(Logger())

	r.GET("/test", func(c *gin.Context) {
		example := c.MustGet("example").(string)

		// akan mencetak: "12345"
		log.Println(example)
	})

	// Jalankan server pada 0.0.0.0:8080
	r.Run(":8080")
}
```

