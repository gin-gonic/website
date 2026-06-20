---
title: "Agrupamento de rotas"
sidebar:
  order: 8
---

Grupos de rotas permitem organizar rotas relacionadas sob um prefixo de URL compartilhado. Isso é útil para:

- **Versionamento de API** -- agrupe todos os endpoints v1 sob `/v1` e endpoints v2 sob `/v2`.
- **Middleware compartilhado** -- aplique autenticação, logging ou rate-limiting a um conjunto inteiro de rotas de uma vez, em vez de anexar middleware a cada rota individualmente.
- **Organização do código** -- mantenha handlers relacionados visualmente agrupados no seu código-fonte.

### Agrupamento básico

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

### Aplicando middleware a um grupo

Você pode passar middleware para `router.Group()` ou chamar `Use()` em um grupo. Cada rota nesse grupo executará o middleware antes do seu handler.

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

### Grupos aninhados

Os grupos podem ser aninhados para construir hierarquias de URL mais profundas, mantendo o middleware com escopo adequado.

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

Cada nível herda o prefixo do seu pai, então as rotas finais se tornam `/api/v1/users/`, `/api/v1/users/:id`, e assim por diante.
