---
title: "미들웨어 내부의 Go루틴"
draft: false
---

미들웨어 혹은 핸들러 내부에서 새로운 Go루틴을 시작하려면, 기존의 context를 **사용해서는 안됩니다.** 읽기 전용으로 복사해서 사용해야 합니다.

```go
func main() {
	r := gin.Default()

	r.GET("/long_async", func(c *gin.Context) {
		// Go루틴 내부에서 사용하기 위한 복사본을 작성합니다.
		cCp := c.Copy()
		go func() {
			// time.Sleep()를 사용하여 장시간(5초) 작업을 시뮬레이션 합니다.
			time.Sleep(5 * time.Second)

			// 중요! 복사된 context인 "cCp"를 사용하세요.
			log.Println("Done! in path " + cCp.Request.URL.Path)
		}()
	})

	r.GET("/long_sync", func(c *gin.Context) {
		// time.Sleep()를 사용하여 장시간(5초) 작업을 시뮬레이션 합니다.
		time.Sleep(5 * time.Second)

		// Go루틴을 사용하지 않는다면, context를 복사할 필요가 없습니다.
		log.Println("Done! in path " + c.Request.URL.Path)
	})

	// 서버가 실행 되고 0.0.0.0:8080 에서 요청을 기다립니다.
	r.Run(":8080")
}
```
