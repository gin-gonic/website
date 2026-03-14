---
title: "라우트 그룹화"
sidebar:
  order: 8
---

라우트 그룹을 사용하면 공유 URL 접두사 아래에 관련 라우트를 구성할 수 있습니다. 이는 다음과 같은 경우에 유용합니다:

- **API 버전 관리** -- 모든 v1 엔드포인트를 `/v1` 아래에, v2 엔드포인트를 `/v2` 아래에 그룹화합니다.
- **공유 미들웨어** -- 각 라우트에 개별적으로 미들웨어를 부착하는 대신, 전체 라우트 세트에 인증, 로깅 또는 속도 제한을 한 번에 적용합니다.
- **코드 구성** -- 소스 코드에서 관련 핸들러를 시각적으로 그룹화하여 유지합니다.

### 기본 그룹화

```go
package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func loginEndpoint(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"action": "login"})
}

func submitEndpoint(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"action": "submit"})
}

func readEndpoint(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"action": "read"})
}

func main() {
	router := gin.Default()

	// 간단한 그룹: v1
	{
		v1 := router.Group("/v1")
		v1.POST("/login", loginEndpoint)
		v1.POST("/submit", submitEndpoint)
		v1.POST("/read", readEndpoint)
	}

	// 간단한 그룹: v2
	{
		v2 := router.Group("/v2")
		v2.POST("/login", loginEndpoint)
		v2.POST("/submit", submitEndpoint)
		v2.POST("/read", readEndpoint)
	}

	router.Run(":8080")
}
```

### 그룹에 미들웨어 적용하기

`router.Group()`에 미들웨어를 전달하거나 그룹에서 `Use()`를 호출할 수 있습니다. 해당 그룹의 모든 라우트는 핸들러 전에 미들웨어를 실행합니다.

```go
// AuthRequired는 인증 미들웨어의 플레이스홀더입니다.
func AuthRequired() gin.HandlerFunc {
	return func(c *gin.Context) {
		// ... 토큰, 세션 등을 확인
		c.Next()
	}
}

func main() {
	router := gin.Default()

	// 공개 라우트 -- 인증 불필요
	public := router.Group("/api")
	{
		public.GET("/health", healthCheck)
	}

	// 비공개 라우트 -- 전체 그룹에 인증 미들웨어 적용
	private := router.Group("/api")
	private.Use(AuthRequired())
	{
		private.GET("/profile", getProfile)
		private.POST("/settings", updateSettings)
	}

	router.Run(":8080")
}
```

### 중첩 그룹

그룹을 중첩하여 더 깊은 URL 계층 구조를 구축하면서 미들웨어의 범위를 적절하게 유지할 수 있습니다.

```go
func main() {
	router := gin.Default()

	// /api
	api := router.Group("/api")
	{
		// /api/v1
		v1 := api.Group("/v1")
		{
			// /api/v1/users
			users := v1.Group("/users")
			users.GET("/", listUsers)
			users.GET("/:id", getUser)

			// /api/v1/posts
			posts := v1.Group("/posts")
			posts.GET("/", listPosts)
			posts.GET("/:id", getPost)
		}
	}

	router.Run(":8080")
}
```

각 레벨은 부모의 접두사를 상속하므로, 최종 라우트는 `/api/v1/users/`, `/api/v1/users/:id` 등이 됩니다.
