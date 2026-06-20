---
title: "Mengelompokkan rute"
sidebar:
  order: 8
---

Grup rute memungkinkan Anda mengorganisasi rute terkait di bawah prefix URL bersama. Ini berguna untuk:

- **Pembuatan versi API** -- mengelompokkan semua endpoint v1 di bawah `/v1` dan endpoint v2 di bawah `/v2`.
- **Middleware bersama** -- menerapkan autentikasi, logging, atau rate-limiting ke seluruh set rute sekaligus alih-alih memasang middleware ke setiap rute satu per satu.
- **Organisasi kode** -- menjaga handler terkait terkelompok secara visual dalam kode sumber Anda.

### Pengelompokan dasar

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

	// Grup sederhana: v1
	{
		v1 := router.Group("/v1")
		v1.POST("/login", loginEndpoint)
		v1.POST("/submit", submitEndpoint)
		v1.POST("/read", readEndpoint)
	}

	// Grup sederhana: v2
	{
		v2 := router.Group("/v2")
		v2.POST("/login", loginEndpoint)
		v2.POST("/submit", submitEndpoint)
		v2.POST("/read", readEndpoint)
	}

	router.Run(":8080")
}
```

### Menerapkan middleware ke grup

Anda dapat meneruskan middleware ke `router.Group()` atau memanggil `Use()` pada grup. Setiap rute dalam grup tersebut akan menjalankan middleware sebelum handler-nya.

```go
// AuthRequired adalah placeholder untuk middleware autentikasi Anda.
func AuthRequired() gin.HandlerFunc {
	return func(c *gin.Context) {
		// ... periksa token, session, dll.
		c.Next()
	}
}

func main() {
	router := gin.Default()

	// Rute publik -- tidak memerlukan autentikasi
	public := router.Group("/api")
	{
		public.GET("/health", healthCheck)
	}

	// Rute privat -- middleware autentikasi diterapkan ke seluruh grup
	private := router.Group("/api")
	private.Use(AuthRequired())
	{
		private.GET("/profile", getProfile)
		private.POST("/settings", updateSettings)
	}

	router.Run(":8080")
}
```

### Grup bertingkat

Grup dapat disusun bertingkat untuk membangun hierarki URL yang lebih dalam sambil menjaga cakupan middleware yang tepat.

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

Setiap level mewarisi prefix dari induknya, sehingga rute akhir menjadi `/api/v1/users/`, `/api/v1/users/:id`, dan seterusnya.
