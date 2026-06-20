---
title: "Rota gruplama"
sidebar:
  order: 8
---

Rota grupları, ilgili rotaları ortak bir URL ön eki altında düzenlemenizi sağlar. Bu şunlar için faydalıdır:

- **API sürümleme** -- tüm v1 uç noktalarını `/v1` altında ve v2 uç noktalarını `/v2` altında gruplama.
- **Paylaşımlı ara katman** -- kimlik doğrulama, loglama veya hız sınırlama gibi işlemleri her rotaya ayrı ayrı eklemek yerine tüm rota kümesine bir kerede uygulama.
- **Kod organizasyonu** -- ilgili işleyicileri kaynak kodunuzda görsel olarak gruplu tutma.

### Temel gruplama

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

### Bir gruba ara katman uygulama

`router.Group()` fonksiyonuna ara katman geçirebilir veya bir grup üzerinde `Use()` çağırabilirsiniz. Bu gruptaki her rota, işleyicisinden önce ara katmanı çalıştıracaktır.

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

### İç içe gruplar

Gruplar, ara katmanı uygun şekilde kapsamlı tutarak daha derin URL hiyerarşileri oluşturmak için iç içe yerleştirilebilir.

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

Her seviye üst grubun ön ekini devralır, böylece son rotalar `/api/v1/users/`, `/api/v1/users/:id` ve benzeri şekilde oluşur.
