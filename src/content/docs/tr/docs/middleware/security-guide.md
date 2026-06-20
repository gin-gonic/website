---
title: "Güvenlik En İyi Uygulamaları"
sidebar:
  order: 8
---

Web uygulamaları saldırganlar için birincil hedeftir. Kullanıcı girdisi işleyen, veri depolayan veya ters proxy arkasında çalışan bir Gin uygulaması, üretime geçmeden önce bilinçli güvenlik yapılandırmasına ihtiyaç duyar. Bu kılavuz, en önemli savunmaları kapsar ve her birinin Gin ara katmanı ve standart Go kütüphaneleriyle nasıl uygulanacağını gösterir.

:::note
Güvenlik katmanlıdır. Bu listedeki hiçbir teknik tek başına yeterli değildir. Derinlemesine savunma oluşturmak için ilgili tüm bölümleri uygulayın.
:::

## CORS yapılandırması

Cross-Origin Resource Sharing (CORS), hangi harici alanların API'nize istek yapabileceğini kontrol eder. Yanlış yapılandırılmış CORS, kötü niyetli web sitelerinin kimliği doğrulanmış kullanıcılar adına sunucunuzdan yanıtları okumasına izin verebilir.

İyi test edilmiş bir çözüm için [`gin-contrib/cors`](https://github.com/gin-contrib/cors) paketini kullanın.

```go
package main

import (
  "time"

  "github.com/gin-contrib/cors"
  "github.com/gin-gonic/gin"
)

func main() {
  r := gin.Default()

  r.Use(cors.New(cors.Config{
    AllowOrigins:     []string{"https://example.com"},
    AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
    AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
    ExposeHeaders:    []string{"Content-Length"},
    AllowCredentials: true,
    MaxAge:           12 * time.Hour,
  }))

  r.GET("/api/data", func(c *gin.Context) {
    c.JSON(200, gin.H{"message": "ok"})
  })

  r.Run()
}
```

:::note
`AllowOrigins: []string{"*"}` ile `AllowCredentials: true`'yu birlikte asla kullanmayın. Bu, tarayıcılara herhangi bir sitenin API'nize kimliği doğrulanmış istekler yapabileceğini söyler.
:::

## CSRF koruması

Cross-Site Request Forgery, kimliği doğrulanmış bir kullanıcının tarayıcısını uygulamanıza istenmeyen istekler göndermeye yönlendirir. Kimlik doğrulama için çerezlere dayanan herhangi bir durum değiştiren uç nokta (POST, PUT, DELETE) CSRF korumasına ihtiyaç duyar.

Token tabanlı koruma eklemek için [`gin-contrib/csrf`](https://github.com/gin-contrib/csrf) ara katmanını kullanın.

```go
package main

import (
  "github.com/gin-contrib/csrf"
  "github.com/gin-contrib/sessions"
  "github.com/gin-contrib/sessions/cookie"
  "github.com/gin-gonic/gin"
)

func main() {
  r := gin.Default()

  store := cookie.NewStore([]byte("session-secret"))
  r.Use(sessions.Sessions("mysession", store))

  r.Use(csrf.Middleware(csrf.Options{
    Secret: "csrf-token-secret",
    ErrorFunc: func(c *gin.Context) {
      c.String(403, "CSRF token mismatch")
      c.Abort()
    },
  }))

  r.GET("/form", func(c *gin.Context) {
    token := csrf.GetToken(c)
    c.JSON(200, gin.H{"csrf_token": token})
  })

  r.POST("/form", func(c *gin.Context) {
    c.JSON(200, gin.H{"message": "submitted"})
  })

  r.Run()
}
```

:::note
CSRF koruması, çerez tabanlı kimlik doğrulama kullanan uygulamalar için kritiktir. Yalnızca `Authorization` başlıklarına (ör., Bearer tokenlar) dayanan API'ler, tarayıcılar bu başlıkları otomatik olarak eklemediği için CSRF'ye karşı savunmasız değildir.
:::

## Hız sınırlama

Hız sınırlama, kötüye kullanımı, kaba kuvvet saldırılarını ve kaynak tükenmesini önler. Ara katman olarak basit bir istemci başına hız sınırlayıcı oluşturmak için standart kütüphanenin `golang.org/x/time/rate` paketini kullanabilirsiniz.

```go
package main

import (
  "net/http"
  "sync"

  "github.com/gin-gonic/gin"
  "golang.org/x/time/rate"
)

func RateLimiter() gin.HandlerFunc {
  type client struct {
    limiter *rate.Limiter
  }

  var (
    mu      sync.Mutex
    clients = make(map[string]*client)
  )

  return func(c *gin.Context) {
    ip := c.ClientIP()

    mu.Lock()
    if _, exists := clients[ip]; !exists {
      // Allow 10 requests per second with a burst of 20
      clients[ip] = &client{limiter: rate.NewLimiter(10, 20)}
    }
    cl := clients[ip]
    mu.Unlock()

    if !cl.limiter.Allow() {
      c.AbortWithStatusJSON(http.StatusTooManyRequests, gin.H{
        "error": "rate limit exceeded",
      })
      return
    }

    c.Next()
  }
}

func main() {
  r := gin.Default()
  r.Use(RateLimiter())

  r.GET("/api/resource", func(c *gin.Context) {
    c.JSON(200, gin.H{"message": "ok"})
  })

  r.Run()
}
```

:::note
Yukarıdaki örnek, sınırlayıcıları bellekteki bir haritada saklar. Üretimde, eski girişlerin periyodik temizliğini eklemelisiniz ve birden fazla uygulama örneği çalıştırıyorsanız dağıtılmış bir hız sınırlayıcı (ör., Redis destekli) kullanmayı düşünmelisiniz.
:::

## Girdi doğrulama ve SQL enjeksiyonu önleme

Her zaman Gin'in model bağlamasını struct etiketleriyle kullanarak girdiyi doğrulayın ve bağlayın. Kullanıcı girdisini birleştirerek asla SQL sorguları oluşturmayın.

### Struct etiketleriyle girdi doğrulama

```go
type CreateUser struct {
  Username string `json:"username" binding:"required,alphanum,min=3,max=30"`
  Email    string `json:"email"    binding:"required,email"`
  Age      int    `json:"age"      binding:"required,gte=1,lte=130"`
}

func createUserHandler(c *gin.Context) {
  var req CreateUser
  if err := c.ShouldBindJSON(&req); err != nil {
    c.JSON(400, gin.H{"error": err.Error()})
    return
  }
  // req is now validated; proceed safely
}
```

### Parametreli sorgular kullanın

```go
// DANGEROUS -- SQL injection vulnerability
row := db.QueryRow("SELECT id FROM users WHERE username = '" + username + "'")

// SAFE -- parameterized query
row := db.QueryRow("SELECT id FROM users WHERE username = $1", username)
```

Bu, her veritabanı kütüphanesi için geçerlidir. `database/sql`, GORM, sqlx veya başka bir ORM kullanın, her zaman parametre yer tutucuları kullanın ve asla dize birleştirme yapmayın.

:::note
Girdi doğrulama ve parametreli sorgular, enjeksiyon saldırılarına karşı en önemli iki savunmanızdır. Tek başına hiçbiri yeterli değildir -- ikisini birden kullanın.
:::

## XSS önleme

Cross-Site Scripting (XSS), bir saldırganın diğer kullanıcıların tarayıcılarında çalışan kötü amaçlı betikler enjekte etmesi durumunda gerçekleşir. Buna karşı birden fazla katmanda savunma yapın.

### HTML çıktısını kaçışlama

HTML şablonları işlerken, Go'nun `html/template` paketi çıktıyı varsayılan olarak kaçışlar. Kullanıcı tarafından sağlanan verileri JSON olarak döndürüyorsanız, `Content-Type` başlığının doğru ayarlandığından emin olun, böylece tarayıcılar JSON'u HTML olarak yorumlamaz.

```go
// Gin sets Content-Type automatically for JSON responses.
// Use c.JSON, not c.String, when returning structured data.
c.JSON(200, gin.H{"input": userInput})
```

### JSONP koruması için SecureJSON kullanın

Gin, JSON ele geçirmesini önlemek için `while(1);` ekleyen `c.SecureJSON` sağlar.

```go
c.SecureJSON(200, gin.H{"data": userInput})
```

### Gerektiğinde Content-Type'ı açıkça ayarlayın

```go
// For API endpoints, always return JSON
c.Header("Content-Type", "application/json; charset=utf-8")
c.Header("X-Content-Type-Options", "nosniff")
```

`X-Content-Type-Options: nosniff` başlığı, tarayıcıların MIME türü koklamasını önler ve sunucu başka bir şey olarak bildirdiğinde yanıtı HTML olarak yorumlamalarını engeller.

## Güvenlik başlıkları ara katmanı

Güvenlik başlıkları eklemek, en basit ve en etkili sağlamlaştırma adımlarından biridir. Ayrıntılı bir örnek için [Güvenlik Başlıkları](/tr/docs/middleware/security-headers/) sayfasına bakın. Aşağıda temel başlıkların hızlı bir özeti bulunmaktadır.

```go
func SecurityHeaders() gin.HandlerFunc {
  return func(c *gin.Context) {
    c.Header("X-Frame-Options", "DENY")
    c.Header("X-Content-Type-Options", "nosniff")
    c.Header("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
    c.Header("Content-Security-Policy", "default-src 'self'")
    c.Header("Referrer-Policy", "strict-origin")
    c.Header("Permissions-Policy", "geolocation=(), camera=(), microphone=()")
    c.Next()
  }
}
```

| Başlık | Neyi önler |
|--------|------------|
| `X-Frame-Options: DENY` | iframe'ler aracılığıyla clickjacking |
| `X-Content-Type-Options: nosniff` | MIME türü koklama saldırıları |
| `Strict-Transport-Security` | Protokol düşürme ve çerez ele geçirme |
| `Content-Security-Policy` | XSS ve veri enjeksiyonu |
| `Referrer-Policy` | Hassas URL parametrelerinin üçüncü taraflara sızması |
| `Permissions-Policy` | Tarayıcı API'lerinin yetkisiz kullanımı (kamera, mikrofon vb.) |

## Güvenilir proxy'ler

Uygulamanız bir ters proxy veya yük dengeleyici arkasında çalışıyorsa, Gin'e hangi proxy'lere güveneceğini söylemelisiniz. Bu yapılandırma olmadan, saldırganlar IP tabanlı erişim kontrollerini ve hız sınırlamayı atlamak için `X-Forwarded-For` başlığını taklit edebilir.

```go
// Trust only your known proxy addresses
router.SetTrustedProxies([]string{"10.0.0.1", "192.168.1.0/24"})
```

Tam açıklama ve yapılandırma seçenekleri için [Güvenilir Proxy'ler](/tr/docs/server-config/trusted-proxies/) sayfasına bakın.

## HTTPS ve TLS

Tüm üretim Gin uygulamaları trafiği HTTPS üzerinden sunmalıdır. Gin, Let's Encrypt aracılığıyla otomatik TLS sertifikalarını destekler.

```go
import "github.com/gin-gonic/autotls"

func main() {
  r := gin.Default()
  // ... routes ...
  log.Fatal(autotls.Run(r, "example.com"))
}
```

Özel sertifika yöneticileri dahil olmak üzere eksiksiz kurulum talimatları için [Let's Encrypt Desteği](/tr/docs/server-config/support-lets-encrypt/) sayfasına bakın.

:::note
Protokol düşürme saldırılarını önlemek için HTTPS'i her zaman `Strict-Transport-Security` başlığı (HSTS) ile birleştirin. HSTS başlığı ayarlandığında, tarayıcılar düz HTTP üzerinden bağlanmayı reddedecektir.
:::

## Ayrıca bakınız

- [Güvenlik Başlıkları](/tr/docs/middleware/security-headers/)
- [Güvenilir Proxy'ler](/tr/docs/server-config/trusted-proxies/)
- [Let's Encrypt Desteği](/tr/docs/server-config/support-lets-encrypt/)
- [Özel Ara Katman](/tr/docs/middleware/custom-middleware/)
- [Bağlama ve Doğrulama](/tr/docs/binding/binding-and-validation/)
