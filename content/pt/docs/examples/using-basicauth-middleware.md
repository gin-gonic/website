---
title: "Usar o Intermediário de BasicAuth"
draft: false
---

```go
// simular alguns dados privados
var secrets = gin.H{
	"foo":    gin.H{"email": "foo@bar.com", "phone": "123433"},
	"austin": gin.H{"email": "austin@example.com", "phone": "666"},
	"lena":   gin.H{"email": "lena@guapa.com", "phone": "523443"},
}

func main() {
	router := gin.Default()

	// grupo usando intermediário de "gin.BasicAuth()"
	// "gin.Accounts" é um atalho para "map[string]string"
	authorized := router.Group("/admin", gin.BasicAuth(gin.Accounts{
		"foo":    "bar",
		"austin": "1234",
		"lena":   "hello2",
		"manu":   "4321",
	}))

	// o destino /admin/secrets
	// alcança "localhost:8080/admin/secrets"
	authorized.GET("/secrets", func(c *gin.Context) {
		// receber utilizador, foi definido pelo intermediário de BasicAuth
		user := c.MustGet(gin.AuthUserKey).(string)
		if secret, ok := secrets[user]; ok {
			c.JSON(http.StatusOK, gin.H{"user": user, "secret": secret})
		} else {
			c.JSON(http.StatusOK, gin.H{"user": user, "secret": "NO SECRET :("})
		}
	})

	// ouvir e servir no 0.0.0.0:8080
	router.Run(":8080")
}
```
