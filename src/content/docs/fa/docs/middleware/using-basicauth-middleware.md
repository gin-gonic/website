---
title: "استفاده از میان‌افزار BasicAuth"
sidebar:
  order: 5
---

Gin دارای میان‌افزار داخلی `gin.BasicAuth()` است که [احراز هویت پایه HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#basic_authentication_scheme) را پیاده‌سازی می‌کند. این میان‌افزار یک map `gin.Accounts` (میانبر برای `map[string]string`) از جفت‌های نام کاربری/رمز عبور می‌پذیرد و هر گروه مسیری که روی آن اعمال شود را محافظت می‌کند.

:::caution[هشدار امنیتی]
احراز هویت پایه HTTP اعتبارنامه‌ها را به صورت رشته **کدگذاری شده Base64** و **بدون رمزنگاری** ارسال می‌کند. هر کسی که بتواند ترافیک را رهگیری کند می‌تواند اعتبارنامه‌ها را به سادگی رمزگشایی کند. همیشه هنگام استفاده از BasicAuth در تولید از **HTTPS** (TLS) استفاده کنید.
:::

:::note[اعتبارنامه‌های تولیدی]
مثال زیر نام‌های کاربری و رمزهای عبور را برای سادگی به صورت ثابت کدنویسی کرده است. در یک برنامه واقعی، اعتبارنامه‌ها را از یک منبع امن مانند متغیرهای محیطی، مدیر اسرار (مثلاً HashiCorp Vault، AWS Secrets Manager) یا پایگاه داده با رمزهای عبور به درستی هش شده بارگذاری کنید. هرگز اعتبارنامه‌های متن ساده را به کنترل نسخه ارسال نکنید.
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

### امتحان کنید

از فلگ `-u` با curl برای ارائه اعتبارنامه‌های احراز هویت پایه استفاده کنید:

```bash
# Successful authentication
curl -u foo:bar http://localhost:8080/admin/secrets
# => {"secret":{"email":"foo@bar.com","phone":"123433"},"user":"foo"}

# Wrong password -- returns 401 Unauthorized
curl -u foo:wrongpassword http://localhost:8080/admin/secrets

# No credentials -- returns 401 Unauthorized
curl http://localhost:8080/admin/secrets
```
