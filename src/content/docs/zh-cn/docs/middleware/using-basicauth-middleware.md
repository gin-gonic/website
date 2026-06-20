---
title: "使用 BasicAuth 中间件"
sidebar:
  order: 5
---

Gin 内置了 `gin.BasicAuth()` 中间件，实现了 [HTTP 基本认证](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#basic_authentication_scheme)。它接受一个 `gin.Accounts` 映射（`map[string]string` 的快捷方式），包含用户名/密码对，并保护应用它的任何路由组。

:::caution[安全警告]
HTTP 基本认证以 **Base64 编码**字符串传输凭据，**未加密**。任何能拦截流量的人都可以轻易解码凭据。在生产环境中使用 BasicAuth 时务必使用 **HTTPS**（TLS）。
:::

:::note[生产凭据]
下面的示例为了简单起见硬编码了用户名和密码。在实际应用中，请从安全来源加载凭据，如环境变量、密钥管理器（例如 HashiCorp Vault、AWS Secrets Manager）或使用正确哈希密码的数据库。永远不要将明文凭据提交到版本控制。
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

### 试一试

使用 curl 的 `-u` 标志提供基本认证凭据：

```bash
# Successful authentication
curl -u foo:bar http://localhost:8080/admin/secrets
# => {"secret":{"email":"foo@bar.com","phone":"123433"},"user":"foo"}

# Wrong password -- returns 401 Unauthorized
curl -u foo:wrongpassword http://localhost:8080/admin/secrets

# No credentials -- returns 401 Unauthorized
curl http://localhost:8080/admin/secrets
```
