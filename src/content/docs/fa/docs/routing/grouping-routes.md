---
title: "گروه‌بندی مسیرها"
sidebar:
  order: 8
---

گروه‌های مسیر به شما امکان می‌دهند مسیرهای مرتبط را تحت یک پیشوند URL مشترک سازماندهی کنید. این برای موارد زیر مفید است:

- **نسخه‌بندی API** -- گروه‌بندی تمام نقاط پایانی v1 تحت `/v1` و نقاط پایانی v2 تحت `/v2`.
- **میان‌افزار مشترک** -- اعمال احراز هویت، لاگ‌گذاری یا محدودیت نرخ روی مجموعه‌ای کامل از مسیرها به جای اتصال میان‌افزار به هر مسیر به صورت جداگانه.
- **سازماندهی کد** -- نگه‌داشتن handlerهای مرتبط به صورت گروه‌بندی شده در کد منبع.

### گروه‌بندی پایه

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

### اعمال میان‌افزار به یک گروه

می‌توانید میان‌افزار را به `router.Group()` ارسال کنید یا `Use()` را روی یک گروه فراخوانی کنید. هر مسیر در آن گروه قبل از handler خود میان‌افزار را اجرا خواهد کرد.

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

### گروه‌های تو در تو

گروه‌ها می‌توانند تو در تو شوند تا سلسله مراتب URL عمیق‌تری ایجاد کنند در حالی که میان‌افزار به درستی محدود می‌ماند.

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

هر سطح پیشوند والد خود را به ارث می‌برد، بنابراین مسیرهای نهایی `/api/v1/users/`، `/api/v1/users/:id` و غیره خواهند بود.
