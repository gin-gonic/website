---
title: "Использование BasicAuth middleware"
sidebar:
  order: 5
---

Gin поставляется со встроенным middleware `gin.BasicAuth()`, который реализует [HTTP Basic-аутентификацию](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#basic_authentication_scheme). Он принимает map `gin.Accounts` (сокращение для `map[string]string`) пар логин/пароль и защищает любую группу маршрутов, к которой он применён.

:::caution[Предупреждение безопасности]
HTTP Basic-аутентификация передаёт учётные данные в виде строки в **кодировке Base64**, **не зашифрованной**. Любой, кто может перехватить трафик, может легко декодировать учётные данные. Всегда используйте **HTTPS** (TLS) при использовании BasicAuth в продакшне.
:::

:::note[Учётные данные для продакшна]
В примере ниже логины и пароли захардкожены для простоты. В реальном приложении загружайте учётные данные из безопасного источника, такого как переменные окружения, менеджер секретов (например, HashiCorp Vault, AWS Secrets Manager) или база данных с правильно хешированными паролями. Никогда не коммитьте учётные данные в открытом виде в систему контроля версий.
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

### Попробуйте

Используйте флаг `-u` с curl для передачи учётных данных Basic-аутентификации:

```bash
# Successful authentication
curl -u foo:bar http://localhost:8080/admin/secrets
# => {"secret":{"email":"foo@bar.com","phone":"123433"},"user":"foo"}

# Wrong password -- returns 401 Unauthorized
curl -u foo:wrongpassword http://localhost:8080/admin/secrets

# No credentials -- returns 401 Unauthorized
curl http://localhost:8080/admin/secrets
```
