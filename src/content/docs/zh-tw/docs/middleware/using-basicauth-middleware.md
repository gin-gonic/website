---
title: "使用 BasicAuth 中介軟體"
sidebar:
  order: 5
---

Gin 內建了 `gin.BasicAuth()` 中介軟體，實作了 [HTTP 基本身份驗證](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#basic_authentication_scheme)。它接受一個 `gin.Accounts` 映射（`map[string]string` 的捷徑）來存放使用者名稱/密碼對，並保護所有套用該中介軟體的路由群組。

:::caution[安全警告]
HTTP 基本身份驗證以 **Base64 編碼**字串傳輸憑證，**未加密**。任何能攔截流量的人都可以輕易解碼憑證。在正式環境中使用 BasicAuth 時，務必使用 **HTTPS**（TLS）。
:::

:::note[正式環境憑證]
以下範例為了簡單而將使用者名稱和密碼寫死。在實際應用中，應從安全來源載入憑證，如環境變數、密鑰管理器（例如 HashiCorp Vault、AWS Secrets Manager），或使用正確雜湊密碼的資料庫。切勿將明文憑證提交到版本控制中。
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

### 測試

使用 curl 的 `-u` 旗標來提供基本身份驗證憑證：

```bash
# Successful authentication
curl -u foo:bar http://localhost:8080/admin/secrets
# => {"secret":{"email":"foo@bar.com","phone":"123433"},"user":"foo"}

# Wrong password -- returns 401 Unauthorized
curl -u foo:wrongpassword http://localhost:8080/admin/secrets

# No credentials -- returns 401 Unauthorized
curl http://localhost:8080/admin/secrets
```
