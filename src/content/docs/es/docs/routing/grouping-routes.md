---
title: "Agrupación de rutas"
sidebar:
  order: 8
---

Los grupos de rutas te permiten organizar rutas relacionadas bajo un prefijo de URL compartido. Esto es útil para:

- **Versionado de API** -- agrupar todos los endpoints v1 bajo `/v1` y los endpoints v2 bajo `/v2`.
- **Middleware compartido** -- aplicar autenticación, logging o limitación de tasa a un conjunto completo de rutas a la vez en lugar de adjuntar middleware a cada ruta individualmente.
- **Organización del código** -- mantener handlers relacionados agrupados visualmente en tu código fuente.

### Agrupación básica

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

### Aplicar middleware a un grupo

Puedes pasar middleware a `router.Group()` o llamar a `Use()` en un grupo. Cada ruta en ese grupo ejecutará el middleware antes de su handler.

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

### Grupos anidados

Los grupos pueden anidarse para construir jerarquías de URL más profundas manteniendo el middleware con el alcance apropiado.

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

Cada nivel hereda el prefijo de su padre, por lo que las rutas finales se convierten en `/api/v1/users/`, `/api/v1/users/:id`, y así sucesivamente.
