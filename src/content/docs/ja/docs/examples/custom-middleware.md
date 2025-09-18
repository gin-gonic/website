---
title: カスタムミドルウェア
---

```go
func Logger() gin.HandlerFunc {
	return func(c *gin.Context) {
		t := time.Now()

		// サンプル変数を設定
		c.Set("example", "12345")

		// 要求する前

		c.Next()

		// 要求した後
		latency := time.Since(t)
		log.Print(latency)

		// 送信中の状態にアクセス
		status := c.Writer.Status()
		log.Println(status)
	}
}

func main() {
	r := gin.New()
	r.Use(Logger())

	r.GET("/test", func(c *gin.Context) {
		example := c.MustGet("example").(string)

		// "12345" が表示されます
		log.Println(example)
	})

	// 0.0.0.0:8080 でリッスンしサーバーを立てます
	r.Run(":8080")
}
```

