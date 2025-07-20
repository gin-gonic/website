---
title: "使用 BasicAuth 中介軟體"
---

```go
// 模擬一些私密資料
var secrets = gin.H{
  "foo":    gin.H{"email": "foo@bar.com", "phone": "123433"},
  "austin": gin.H{"email": "austin@example.com", "phone": "666"},
  "lena":   gin.H{"email": "lena@guapa.com", "phone": "523443"},
}

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  // 使用 gin.BasicAuth() 中介軟體的分組
  // gin.Accounts 是 map[string]string 的簡寫
  authorized := router.Group("/admin", gin.BasicAuth(gin.Accounts{
    "foo":    "bar",
    "austin": "1234",
    "lena":   "hello2",
    "manu":   "4321",
  }))

  // /admin/secrets 端點
  // 存取 "localhost:8080/admin/secrets"
  authorized.GET("/secrets", func(c *gin.Context) {
    // 取得由 BasicAuth 中介軟體設定的使用者
    user := c.MustGet(gin.AuthUserKey).(string)
    if secret, ok := secrets[user]; ok {
      c.JSON(http.StatusOK, gin.H{"user": user, "secret": secret})
    } else {
      c.JSON(http.StatusOK, gin.H{"user": user, "secret": "沒有秘密 :("})
    }
  })

  // 在 0.0.0.0:8080 上監聽並提供服務
  router.Run(":8080")
}
```
