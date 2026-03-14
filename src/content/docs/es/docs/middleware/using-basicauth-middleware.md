---
title: "Usar middleware BasicAuth"
sidebar:
  order: 5
---

Gin incluye un middleware integrado `gin.BasicAuth()` que implementa [Autenticación HTTP Básica](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#basic_authentication_scheme). Acepta un mapa `gin.Accounts` (un atajo para `map[string]string`) de pares usuario/contraseña y protege cualquier grupo de rutas al que se aplique.

:::caution[Advertencia de seguridad]
La Autenticación HTTP Básica transmite credenciales como una cadena **codificada en Base64**, **no cifrada**. Cualquier persona que pueda interceptar el tráfico puede decodificar las credenciales trivialmente. Siempre usa **HTTPS** (TLS) al usar BasicAuth en producción.
:::

:::note[Credenciales de producción]
El ejemplo a continuación codifica usuarios y contraseñas directamente por simplicidad. En una aplicación real, carga las credenciales desde una fuente segura como variables de entorno, un gestor de secretos (ej. HashiCorp Vault, AWS Secrets Manager), o una base de datos con contraseñas correctamente hasheadas. Nunca guardes credenciales en texto plano en el control de versiones.
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

### Pruébalo

Usa la bandera `-u` con curl para proporcionar credenciales de Autenticación Básica:

```bash
# Successful authentication
curl -u foo:bar http://localhost:8080/admin/secrets
# => {"secret":{"email":"foo@bar.com","phone":"123433"},"user":"foo"}

# Wrong password -- returns 401 Unauthorized
curl -u foo:wrongpassword http://localhost:8080/admin/secrets

# No credentials -- returns 401 Unauthorized
curl http://localhost:8080/admin/secrets
```
