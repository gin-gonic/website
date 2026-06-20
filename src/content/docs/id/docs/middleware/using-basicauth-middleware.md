---
title: "Menggunakan middleware BasicAuth"
sidebar:
  order: 5
---

Gin dilengkapi dengan middleware `gin.BasicAuth()` bawaan yang mengimplementasikan [Autentikasi HTTP Basic](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#basic_authentication_scheme). Middleware ini menerima map `gin.Accounts` (pintasan untuk `map[string]string`) berisi pasangan username/password dan melindungi grup rute yang diterapkan.

:::caution[Peringatan Keamanan]
Autentikasi HTTP Basic mentransmisikan kredensial sebagai string **berenkode Base64**, **bukan terenkripsi**. Siapa pun yang dapat mencegat lalu lintas dapat mendekode kredensial dengan mudah. Selalu gunakan **HTTPS** (TLS) saat menggunakan BasicAuth di produksi.
:::

:::note[Kredensial Produksi]
Contoh di bawah meng-hardcode username dan password untuk kesederhanaan. Dalam aplikasi nyata, muat kredensial dari sumber aman seperti variabel lingkungan, pengelola secret (mis., HashiCorp Vault, AWS Secrets Manager), atau database dengan password yang di-hash dengan benar. Jangan pernah meng-commit kredensial plaintext ke version control.
:::

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

// simulate some private data
var secrets = gin.H{
  "foo":    gin.H{"email": "foo@bar.com", "phone": "123433"},
  "austin": gin.H{"email": "austin@example.com", "phone": "666"},
  "lena":   gin.H{"email": "lena@guapa.com", "phone": "523443"},
}

func main() {
  router := gin.Default()

  // Group using gin.BasicAuth() middleware
  // gin.Accounts is a shortcut for map[string]string
  authorized := router.Group("/admin", gin.BasicAuth(gin.Accounts{
    "foo":    "bar",
    "austin": "1234",
    "lena":   "hello2",
    "manu":   "4321",
  }))

  // /admin/secrets endpoint
  // hit "localhost:8080/admin/secrets
  authorized.GET("/secrets", func(c *gin.Context) {
    // get user, it was set by the BasicAuth middleware
    user := c.MustGet(gin.AuthUserKey).(string)
    if secret, ok := secrets[user]; ok {
      c.JSON(http.StatusOK, gin.H{"user": user, "secret": secret})
    } else {
      c.JSON(http.StatusOK, gin.H{"user": user, "secret": "NO SECRET :("})
    }
  })

  // Listen and serve on 0.0.0.0:8080
  router.Run(":8080")
}
```

### Coba jalankan

Gunakan flag `-u` dengan curl untuk memberikan kredensial Basic Authentication:

```bash
# Successful authentication
curl -u foo:bar http://localhost:8080/admin/secrets
# => {"secret":{"email":"foo@bar.com","phone":"123433"},"user":"foo"}

# Wrong password -- returns 401 Unauthorized
curl -u foo:wrongpassword http://localhost:8080/admin/secrets

# No credentials -- returns 401 Unauthorized
curl http://localhost:8080/admin/secrets
```
