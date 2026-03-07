---
title: "Menggunakan middleware BasicAuth"
---

```go
// simulasi beberapa data pribadi
var secrets = gin.H{
  "foo":    gin.H{"email": "foo@bar.com", "phone": "123433"},
  "austin": gin.H{"email": "austin@example.com", "phone": "666"},
  "lena":   gin.H{"email": "lena@guapa.com", "phone": "523443"},
}

func main() {
  router := gin.Default()

  // Grup menggunakan middleware gin.BasicAuth()
  // gin.Accounts adalah pintasan untuk map[string]string
  authorized := router.Group("/admin", gin.BasicAuth(gin.Accounts{
    "foo":    "bar",
    "austin": "1234",
    "lena":   "hello2",
    "manu":   "4321",
  }))

  // endpoint /admin/secrets
  // akses "localhost:8080/admin/secrets"
  authorized.GET("/secrets", func(c *gin.Context) {
    // dapatkan pengguna, ini diatur oleh middleware BasicAuth
    user := c.MustGet(gin.AuthUserKey).(string)
    if secret, ok := secrets[user]; ok {
      c.JSON(http.StatusOK, gin.H{"user": user, "secret": secret})
    } else {
      c.JSON(http.StatusOK, gin.H{"user": user, "secret": "NO SECRET :("})
    }
  })

  // Jalankan server pada 0.0.0.0:8080
  router.Run(":8080")
}
```
