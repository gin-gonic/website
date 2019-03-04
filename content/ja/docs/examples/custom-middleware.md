---
title: "カスタムミドルウェア"
draft: false
---

```go
func Logger() gin.HandlerFunc {
	return func(c *gin.Context) {
		t := time.Now()

		// サンプル変数を設定
		c.Set("example", "12345")

		// request 処理の前

		c.Next()

		// request 処理の後
		latency := time.Since(t)
		log.Print(latency)

		// 送信予定のステータスコードにアクセスする
		status := c.Writer.Status()
		log.Println(status)
	}
}

func main() {
	r := gin.New()
	r.Use(Logger())

	r.GET("/test", func(c *gin.Context) {
		example := c.MustGet("example").(string)

		// "12345" が表示される
		log.Println(example)
	})

	// 0.0.0.0:8080 でサーバーを立てます。
	r.Run(":8080")
}
```


