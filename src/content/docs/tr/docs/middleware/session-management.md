---
title: "Oturum Yönetimi"
sidebar:
  order: 9
---

Oturumlar, birden fazla HTTP isteği boyunca kullanıcıya özgü verileri depolamanıza olanak tanır. HTTP durumsuz olduğundan, oturumlar geri dönen kullanıcıları tanımlamak ve saklanan verilerini almak için çerezler veya diğer mekanizmaları kullanır.

## gin-contrib/sessions kullanımı

[gin-contrib/sessions](https://github.com/gin-contrib/sessions) ara katmanı, birden fazla arka uç depolama alanıyla oturum yönetimi sağlar:

```sh
go get github.com/gin-contrib/sessions
```

### Çerez tabanlı oturumlar

En basit yaklaşım, oturum verilerini şifrelenmiş çerezlerde saklar:

```go
package main

import (
  "net/http"

  "github.com/gin-contrib/sessions"
  "github.com/gin-contrib/sessions/cookie"
  "github.com/gin-gonic/gin"
)

func main() {
  r := gin.Default()

  // Create cookie-based session store with a secret key
  store := cookie.NewStore([]byte("your-secret-key"))
  r.Use(sessions.Sessions("mysession", store))

  r.GET("/login", func(c *gin.Context) {
    session := sessions.Default(c)
    session.Set("user", "john")
    session.Save()
    c.JSON(http.StatusOK, gin.H{"message": "logged in"})
  })

  r.GET("/profile", func(c *gin.Context) {
    session := sessions.Default(c)
    user := session.Get("user")
    if user == nil {
      c.JSON(http.StatusUnauthorized, gin.H{"error": "not logged in"})
      return
    }
    c.JSON(http.StatusOK, gin.H{"user": user})
  })

  r.GET("/logout", func(c *gin.Context) {
    session := sessions.Default(c)
    session.Clear()
    session.Save()
    c.JSON(http.StatusOK, gin.H{"message": "logged out"})
  })

  r.Run(":8080")
}
```

### Redis tabanlı oturumlar

Üretim uygulamaları için, birden fazla örnek arasında ölçeklenebilirlik sağlamak üzere oturumları Redis'te saklayın:

```go
package main

import (
  "net/http"

  "github.com/gin-contrib/sessions"
  "github.com/gin-contrib/sessions/redis"
  "github.com/gin-gonic/gin"
)

func main() {
  r := gin.Default()

  // Connect to Redis for session storage
  store, err := redis.NewStore(10, "tcp", "localhost:6379", "", []byte("secret"))
  if err != nil {
    panic(err)
  }
  r.Use(sessions.Sessions("mysession", store))

  r.GET("/set", func(c *gin.Context) {
    session := sessions.Default(c)
    session.Set("count", 1)
    session.Save()
    c.JSON(http.StatusOK, gin.H{"count": 1})
  })

  r.GET("/get", func(c *gin.Context) {
    session := sessions.Default(c)
    count := session.Get("count")
    c.JSON(http.StatusOK, gin.H{"count": count})
  })

  r.Run(":8080")
}
```

## Oturum seçenekleri

`sessions.Options` ile oturum davranışını yapılandırın:

```go
session := sessions.Default(c)
session.Options(sessions.Options{
  Path:     "/",
  MaxAge:   3600,        // Session expires in 1 hour (seconds)
  HttpOnly: true,        // Prevent JavaScript access
  Secure:   true,        // Only send over HTTPS
  SameSite: http.SameSiteLaxMode,
})
```

| Seçenek | Açıklama |
|---------|----------|
| `Path` | Çerez yol kapsamı (varsayılan: `/`) |
| `MaxAge` | Saniye cinsinden ömür. Silmek için `-1`, tarayıcı oturumu için `0` kullanın |
| `HttpOnly` | Çereze JavaScript erişimini engeller |
| `Secure` | Çerezi yalnızca HTTPS üzerinden gönderir |
| `SameSite` | Çapraz site çerez davranışını kontrol eder (`Lax`, `Strict`, `None`) |

:::note
Oturum çerezlerini XSS ve ortadaki adam saldırılarından korumak için üretimde her zaman `HttpOnly: true` ve `Secure: true` ayarlayın.
:::

## Mevcut arka uçlar

| Arka uç | Paket | Kullanım senaryosu |
|---------|-------|-------------------|
| Cookie | `sessions/cookie` | Basit uygulamalar, küçük oturum verisi |
| Redis | `sessions/redis` | Üretim, çok örnekli dağıtımlar |
| Memcached | `sessions/memcached` | Yüksek performanslı önbellekleme katmanı |
| MongoDB | `sessions/mongo` | MongoDB birincil veri deponuz olduğunda |
| PostgreSQL | `sessions/postgres` | PostgreSQL birincil veri deponuz olduğunda |

## Oturumlar ve JWT karşılaştırması

| Özellik | Oturumlar | JWT |
|---------|-----------|-----|
| Depolama | Sunucu tarafı (Redis, DB) | İstemci tarafı (token) |
| İptal | Kolay (depodan silme) | Zor (engelleme listesi gerektirir) |
| Ölçeklenebilirlik | Paylaşımlı depo gerektirir | Durumsuz |
| Veri boyutu | Sınırsız sunucu tarafı | Token boyutuyla sınırlı |

Kolay iptal gerektiğinde oturumları kullanın (ör., çıkış, kullanıcı yasaklama). Mikro hizmetler arasında durumsuz kimlik doğrulama gerektiğinde JWT kullanın.

## Ayrıca bakınız

- [Çerez işleme](/tr/docs/server-config/cookie/)
- [Güvenlik en iyi uygulamaları](/tr/docs/middleware/security-guide/)
- [Ara katman kullanımı](/tr/docs/middleware/using-middleware/)
