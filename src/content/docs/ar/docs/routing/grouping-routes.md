---
title: "تجميع المسارات"
sidebar:
  order: 8
---

تتيح لك مجموعات المسارات تنظيم المسارات ذات الصلة تحت بادئة URL مشتركة. وهذا مفيد لـ:

- **إصدار الواجهة البرمجية** -- تجميع جميع نقاط نهاية v1 تحت `/v1` ونقاط نهاية v2 تحت `/v2`.
- **الوسيطات المشتركة** -- تطبيق المصادقة أو التسجيل أو تحديد المعدل على مجموعة كاملة من المسارات دفعة واحدة بدلاً من إرفاق الوسيطات بكل مسار على حدة.
- **تنظيم الكود** -- الاحتفاظ بالمعالجات ذات الصلة مجمّعة بصرياً في الكود المصدري.

### التجميع الأساسي

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

### تطبيق الوسيطات على مجموعة

يمكنك تمرير الوسيطات إلى `router.Group()` أو استدعاء `Use()` على مجموعة. كل مسار في تلك المجموعة سيُشغّل الوسيط قبل معالجه.

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

### المجموعات المتداخلة

يمكن تداخل المجموعات لبناء تسلسلات URL أعمق مع الحفاظ على نطاق الوسيطات بشكل مناسب.

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

يرث كل مستوى بادئة المستوى الأعلى منه، وبالتالي تصبح المسارات النهائية `/api/v1/users/` و`/api/v1/users/:id` وهكذا.
