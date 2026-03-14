---
title: "路由分組"
sidebar:
  order: 8
---

路由群組讓你可以將相關路由組織在共用的 URL 前綴下。這適用於：

- **API 版本控制** -- 將所有 v1 端點分組在 `/v1` 下，v2 端點分組在 `/v2` 下。
- **共用中介軟體** -- 一次性對整組路由套用身份驗證、日誌記錄或速率限制，而不是逐一為每個路由附加中介軟體。
- **程式碼組織** -- 在原始碼中讓相關的處理函式保持視覺上的分組。

### 基本分組

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

	// Simple group: v1
	{
		v1 := router.Group("/v1")
		v1.POST("/login", loginEndpoint)
		v1.POST("/submit", submitEndpoint)
		v1.POST("/read", readEndpoint)
	}

	// Simple group: v2
	{
		v2 := router.Group("/v2")
		v2.POST("/login", loginEndpoint)
		v2.POST("/submit", submitEndpoint)
		v2.POST("/read", readEndpoint)
	}

	router.Run(":8080")
}
```

### 對群組套用中介軟體

你可以將中介軟體傳入 `router.Group()`，或對群組呼叫 `Use()`。該群組中的每個路由都會在其處理函式之前執行中介軟體。

```go
// AuthRequired is a placeholder for your auth middleware.
func AuthRequired() gin.HandlerFunc {
	return func(c *gin.Context) {
		// ... check token, session, etc.
		c.Next()
	}
}

func main() {
	router := gin.Default()

	// Public routes -- no auth required
	public := router.Group("/api")
	{
		public.GET("/health", healthCheck)
	}

	// Private routes -- auth middleware applied to the whole group
	private := router.Group("/api")
	private.Use(AuthRequired())
	{
		private.GET("/profile", getProfile)
		private.POST("/settings", updateSettings)
	}

	router.Run(":8080")
}
```

### 巢狀群組

群組可以巢狀建立更深層的 URL 階層結構，同時保持中介軟體的適當作用範圍。

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

每一層都繼承其父層的前綴，因此最終的路由會變成 `/api/v1/users/`、`/api/v1/users/:id`，以此類推。
