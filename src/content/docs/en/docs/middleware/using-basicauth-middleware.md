---
title: "Using BasicAuth middleware"
sidebar:
  order: 5
---

Gin ships with a built-in `gin.BasicAuth()` middleware that implements [HTTP Basic Authentication](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#basic_authentication_scheme). It accepts a `gin.Accounts` map (a shortcut for `map[string]string`) of username/password pairs and protects any route group it is applied to.

:::caution[Security Warning]
HTTP Basic Authentication transmits credentials as a **Base64-encoded** string, **not encrypted**. Anyone who can intercept the traffic can decode the credentials trivially. Always use **HTTPS** (TLS) when using BasicAuth in production.
:::

:::note[Production Credentials]
The example below hardcodes usernames and passwords for simplicity. In a real application, load credentials from a secure source such as environment variables, a secrets manager (e.g., HashiCorp Vault, AWS Secrets Manager), or a database with properly hashed passwords. Never commit plaintext credentials to version control.
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

### Try it

Use the `-u` flag with curl to supply Basic Authentication credentials:

```bash
# Successful authentication
curl -u foo:bar http://localhost:8080/admin/secrets
# => {"secret":{"email":"foo@bar.com","phone":"123433"},"user":"foo"}

# Wrong password -- returns 401 Unauthorized
curl -u foo:wrongpassword http://localhost:8080/admin/secrets

# No credentials -- returns 401 Unauthorized
curl http://localhost:8080/admin/secrets
```
