---
title: "Группировка маршрутов"
sidebar:
  order: 8
---

Группы маршрутов позволяют организовать связанные маршруты под общим URL-префиксом. Это полезно для:

- **Версионирования API** -- группировка всех эндпоинтов v1 под `/v1` и эндпоинтов v2 под `/v2`.
- **Общего middleware** -- применение аутентификации, логирования или ограничения частоты запросов ко всему набору маршрутов сразу, вместо подключения middleware к каждому маршруту отдельно.
- **Организации кода** -- визуальная группировка связанных обработчиков в исходном коде.

### Базовая группировка

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

### Применение middleware к группе

Вы можете передать middleware в `router.Group()` или вызвать `Use()` для группы. Каждый маршрут в этой группе будет выполнять middleware перед своим обработчиком.

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

### Вложенные группы

Группы могут быть вложены для построения более глубоких URL-иерархий с сохранением соответствующей области действия middleware.

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

Каждый уровень наследует префикс родителя, поэтому итоговые маршруты становятся `/api/v1/users/`, `/api/v1/users/:id` и так далее.
