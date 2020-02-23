---
title: "미들웨어를 사용하기"
draft: false
---

```go
func main() {
	// 기본 미들웨어를 포함하지 않는 라우터를 작성합니다.
	r := gin.New()

	// Global middleware
	// GIN_MODE=release로 하더라도 Logger 미들웨어는 gin.DefaultWriter에 로그를 기록합니다.
	// 기본값 gin.DefaultWriter = os.Stdout
	r.Use(gin.Logger())

	// Recovery 미들웨어는 panic이 발생하면 500 에러를 씁니다.
	r.Use(gin.Recovery())

	// 각 라우트 당 원하는만큼 미들웨어를 추가 할 수 있습니다.
	r.GET("/benchmark", MyBenchLogger(), benchEndpoint)

	// 권한 그룹
	// authorized := r.Group("/", AuthRequired())
	// 다음과 동일합니다:
	authorized := r.Group("/")
	// 그룹별로 미들웨어를 사용할 수 있습니다!
	// 이 경우 "authorized"그룹에서만 사용자 정의 생성된 AuthRequired() 미들웨어를 사용합니다.
	authorized.Use(AuthRequired())
	{
		authorized.POST("/login", loginEndpoint)
		authorized.POST("/submit", submitEndpoint)
		authorized.POST("/read", readEndpoint)

		// 중첩 그룹
		testing := authorized.Group("testing")
		testing.GET("/analytics", analyticsEndpoint)
	}

	// 서버가 실행 되고 0.0.0.0:8080 에서 요청을 기다립니다.
	r.Run(":8080")
}
```

