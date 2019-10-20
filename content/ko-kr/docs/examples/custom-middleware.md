---
title: "커스텀 미들웨어"
draft: false
---

```go
func Logger() gin.HandlerFunc {
	return func(c *gin.Context) {
		t := time.Now()

		// 샘플 변수 설정
		c.Set("example", "12345")

		// Request 이전

		c.Next()

		// Request 이후
		latency := time.Since(t)
		log.Print(latency)

		// 송신할 상태 코드에 접근
		status := c.Writer.Status()
		log.Println(status)
	}
}

func main() {
	r := gin.New()
	r.Use(Logger())

	r.GET("/test", func(c *gin.Context) {
		example := c.MustGet("example").(string)

		// 출력내용: "12345"
		log.Println(example)
	})

	// 서버가 실행 되고 0.0.0.0:8080 에서 요청을 기다립니다.
	r.Run(":8080")
}
```

