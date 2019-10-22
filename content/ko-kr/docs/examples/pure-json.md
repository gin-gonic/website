---
title: "PureJSON"
draft: false
---

일반적으로 JSON은 `<`와 같은 HTML문자를 `\u003c`처럼 유니코드로 변환 합니다.
만약 이러한 문자를 그대로 인코딩 하려면 PureJSON을 사용하세요.
이 기능은 Go 1.6 이하에서는 사용할 수 없습니다.

```go
func main() {
	r := gin.Default()

	// 유니코드 엔티티 반환
	r.GET("/json", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"html": "<b>Hello, world!</b>",
		})
	})

	// 리터럴 문자 반환
	r.GET("/purejson", func(c *gin.Context) {
		c.PureJSON(200, gin.H{
			"html": "<b>Hello, world!</b>",
		})
	})

	// 서버가 실행 되고 0.0.0.0:8080 에서 요청을 기다립니다.
	r.Run(":8080")
}
```
