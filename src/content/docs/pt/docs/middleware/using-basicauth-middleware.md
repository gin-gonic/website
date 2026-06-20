---
title: "Usando middleware BasicAuth"
sidebar:
  order: 5
---

O Gin vem com um middleware integrado `gin.BasicAuth()` que implementa [Autenticação HTTP Basic](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#basic_authentication_scheme). Ele aceita um mapa `gin.Accounts` (um atalho para `map[string]string`) de pares usuário/senha e protege qualquer grupo de rotas ao qual é aplicado.

:::caution[Aviso de Segurança]
A Autenticação HTTP Basic transmite credenciais como uma string **codificada em Base64**, **não criptografada**. Qualquer pessoa que possa interceptar o tráfego pode decodificar as credenciais trivialmente. Sempre use **HTTPS** (TLS) ao usar BasicAuth em produção.
:::

:::note[Credenciais de Produção]
O exemplo abaixo codifica nomes de usuário e senhas diretamente no código para simplicidade. Em uma aplicação real, carregue as credenciais de uma fonte segura como variáveis de ambiente, um gerenciador de segredos (ex.: HashiCorp Vault, AWS Secrets Manager) ou um banco de dados com senhas devidamente hasheadas. Nunca faça commit de credenciais em texto puro no controle de versão.
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

### Teste

Use a flag `-u` com curl para fornecer credenciais de Autenticação Basic:

```bash
# Successful authentication
curl -u foo:bar http://localhost:8080/admin/secrets
# => {"secret":{"email":"foo@bar.com","phone":"123433"},"user":"foo"}

# Wrong password -- returns 401 Unauthorized
curl -u foo:wrongpassword http://localhost:8080/admin/secrets

# No credentials -- returns 401 Unauthorized
curl http://localhost:8080/admin/secrets
```
