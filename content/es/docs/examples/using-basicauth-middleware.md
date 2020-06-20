---
title: "Uso del middleware BasicAuth"
draft: false
---

```go
// Se simula una información privada
var secrets = gin.H{
	"foo":    gin.H{"email": "foo@bar.com", "phone": "123433"},
	"austin": gin.H{"email": "austin@example.com", "phone": "666"},
	"lena":   gin.H{"email": "lena@guapa.com", "phone": "523443"},
}

func main() {
	r := gin.Default()

	// Agrupación de rutas usando el middleware gin.BasicAuth()
	// gin.Accounts es una abreviatura para map[string]string
	authorized := r.Group("/admin", gin.BasicAuth(gin.Accounts{
		"foo":    "bar",
		"austin": "1234",
		"lena":   "hello2",
		"manu":   "4321",
	}))

	// el endpoint /admin/secrets
	// será para el url "localhost:8080/admin/secrets
	authorized.GET("/secrets", func(c *gin.Context) {
		// para obtener user, es configurado por el middleware BasicAuth
		user := c.MustGet(gin.AuthUserKey).(string)
		if secret, ok := secrets[user]; ok {
			c.JSON(http.StatusOK, gin.H{"user": user, "secret": secret})
		} else {
			c.JSON(http.StatusOK, gin.H{"user": user, "secret": "NO SECRET :("})
		}
	})

	r.Run(":8080")
}
```
