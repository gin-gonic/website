---
title: "自訂中介軟體"
---

```go
func Logger() gin.HandlerFunc {
	return func(c *gin.Context) {
		t := time.Now()

		// 設定範例變數
		c.Set("example", "12345")

		// 請求前

		c.Next()

		// 請求後
		latency := time.Since(t)
		log.Print(latency)

		// 存取我們正在傳送的狀態
		status := c.Writer.Status()
		log.Println(status)
	}
}

func main() {
	r := gin.New()
	r.Use(Logger())

	r.GET("/test", func(c *gin.Context) {
		example := c.MustGet("example").(string)

		// 它會印出：「12345」
		log.Println(example)
	})

	// 在 0.0.0.0:8080 上監聽並提供服務
	r.Run(":8080")
}
```

