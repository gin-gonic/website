---
title: "استخدام وسيط BasicAuth"
sidebar:
  order: 5
---

يأتي Gin مع وسيط `gin.BasicAuth()` مدمج يُنفذ [مصادقة HTTP الأساسية](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#basic_authentication_scheme). يقبل خريطة `gin.Accounts` (اختصار لـ `map[string]string`) من أزواج اسم المستخدم/كلمة المرور ويحمي أي مجموعة مسارات يُطبق عليها.

:::caution[تحذير أمني]
تنقل المصادقة الأساسية عبر HTTP بيانات الاعتماد كسلسلة **مرمّزة بـ Base64**، **وليست مشفرة**. أي شخص يمكنه اعتراض حركة المرور يمكنه فك ترميز بيانات الاعتماد بسهولة. استخدم دائماً **HTTPS** (TLS) عند استخدام BasicAuth في بيئة الإنتاج.
:::

:::note[بيانات اعتماد الإنتاج]
المثال أدناه يضمّن أسماء المستخدمين وكلمات المرور في الكود للبساطة. في تطبيق حقيقي، حمّل بيانات الاعتماد من مصدر آمن مثل متغيرات البيئة أو مدير أسرار (مثل HashiCorp Vault أو AWS Secrets Manager) أو قاعدة بيانات بكلمات مرور مُجزّأة بشكل صحيح. لا تُرسل أبداً بيانات اعتماد نصية عادية إلى التحكم في الإصدار.
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

### جرّبها

استخدم علم `-u` مع curl لتقديم بيانات اعتماد المصادقة الأساسية:

```bash
# Successful authentication
curl -u foo:bar http://localhost:8080/admin/secrets
# => {"secret":{"email":"foo@bar.com","phone":"123433"},"user":"foo"}

# Wrong password -- returns 401 Unauthorized
curl -u foo:wrongpassword http://localhost:8080/admin/secrets

# No credentials -- returns 401 Unauthorized
curl http://localhost:8080/admin/secrets
```
