---
title: "HTTP 메소드 사용"
draft: false
---

```go
func main() {
	// 기본 미들웨어를 포함한 gin 라우터를 생성합니다:
	// logger와 recovery (crash-free) 미들웨어가 포함됩니다.
	router := gin.Default()

	router.GET("/someGet", getting)
	router.POST("/somePost", posting)
	router.PUT("/somePut", putting)
	router.DELETE("/someDelete", deleting)
	router.PATCH("/somePatch", patching)
	router.HEAD("/someHead", head)
	router.OPTIONS("/someOptions", options)

	// 환경변수에 PORT가 지정되어 있지 않는 경우
	// 기본값으로 8080 포트를 사용합니다.
	router.Run()
	// router.Run(":3000") 와 같이 하드코딩으로 포트를 지정 할 수 있습니다.
}
```
