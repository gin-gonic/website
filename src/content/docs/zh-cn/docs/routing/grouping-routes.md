---
title: "路由分组"
sidebar:
  order: 8
---

路由组允许你将相关路由组织在一个共享的 URL 前缀下。这适用于：

- **API 版本管理** -- 将所有 v1 端点分组到 `/v1` 下，v2 端点分组到 `/v2` 下。
- **共享中间件** -- 将认证、日志记录或限流一次性应用到整组路由，而不是逐个附加到每个路由上。
- **代码组织** -- 在源代码中将相关的处理函数保持在一起。

### 基本分组

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

### 将中间件应用到分组

你可以将中间件传递给 `router.Group()` 或在组上调用 `Use()`。该组中的每个路由都会在其处理函数之前运行中间件。

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

### 嵌套分组

分组可以嵌套以构建更深层的 URL 层次结构，同时保持中间件的合理作用范围。

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

每一级都会继承父级的前缀，因此最终的路由会变成 `/api/v1/users/`、`/api/v1/users/:id` 等。
