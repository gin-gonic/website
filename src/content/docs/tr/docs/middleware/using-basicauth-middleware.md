---
title: "BasicAuth ara katmanı kullanımı"
sidebar:
  order: 5
---

Gin, [HTTP Temel Kimlik Doğrulamayı](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#basic_authentication_scheme) uygulayan yerleşik bir `gin.BasicAuth()` ara katmanıyla birlikte gelir. Kullanıcı adı/şifre çiftlerinden oluşan bir `gin.Accounts` haritası (`map[string]string` için kısayol) kabul eder ve uygulandığı herhangi bir rota grubunu korur.

:::caution[Güvenlik Uyarısı]
HTTP Temel Kimlik Doğrulama, kimlik bilgilerini **şifrelenmemiş** olarak **Base64 kodlu** bir dize olarak iletir. Trafiği yakalayabilen herkes kimlik bilgilerini kolayca çözebilir. Üretimde BasicAuth kullanırken her zaman **HTTPS** (TLS) kullanın.
:::

:::note[Üretim Kimlik Bilgileri]
Aşağıdaki örnek, basitlik için kullanıcı adları ve şifreleri sabit olarak kodlar. Gerçek bir uygulamada, kimlik bilgilerini ortam değişkenleri, bir gizli bilgi yöneticisi (ör., HashiCorp Vault, AWS Secrets Manager) veya düzgün şekilde hashlenmiş şifreler içeren bir veritabanı gibi güvenli bir kaynaktan yükleyin. Düz metin kimlik bilgilerini asla sürüm kontrolüne işlemeyin.
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

### Deneyin

Temel Kimlik Doğrulama bilgilerini sağlamak için curl ile `-u` bayrağını kullanın:

```bash
# Successful authentication
curl -u foo:bar http://localhost:8080/admin/secrets
# => {"secret":{"email":"foo@bar.com","phone":"123433"},"user":"foo"}

# Wrong password -- returns 401 Unauthorized
curl -u foo:wrongpassword http://localhost:8080/admin/secrets

# No credentials -- returns 401 Unauthorized
curl http://localhost:8080/admin/secrets
```
