---
title: "SSS"
sidebar:
  order: 15
---

## Genel Sorular

### Geliştirme sırasında canlı yeniden yüklemeyi nasıl etkinleştiririm?

Geliştirme sırasında otomatik canlı yeniden yükleme için [Air](https://github.com/air-verse/air) kullanın. Air dosyalarınızı izler ve değişiklikler algılandığında uygulamanızı yeniden derler/başlatır.

**Kurulum:**

```sh
go install github.com/air-verse/air@latest
```

**Ayarlama:**

Proje kök dizininizde bir `.air.toml` yapılandırma dosyası oluşturun:

```sh
air init
```

Ardından proje dizininizde `go run` yerine `air` çalıştırın:

```sh
air
```

Air, `.go` dosyalarınızı izler ve değişikliklerde Gin uygulamanızı otomatik olarak yeniden derler/başlatır. Yapılandırma seçenekleri için [Air belgelerine](https://github.com/air-verse/air) bakın.

### Gin'de CORS'u nasıl yönetirim?

Resmi [gin-contrib/cors](https://github.com/gin-contrib/cors) ara katmanını kullanın:

```go
package main

import (
  "time"

  "github.com/gin-contrib/cors"
  "github.com/gin-gonic/gin"
)

func main() {
  r := gin.Default()

  // Default CORS configuration
  r.Use(cors.Default())

  // Or customize CORS settings
  r.Use(cors.New(cors.Config{
    AllowOrigins:     []string{"https://example.com"},
    AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
    AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
    ExposeHeaders:    []string{"Content-Length"},
    AllowCredentials: true,
    MaxAge:           12 * time.Hour,
  }))

  r.GET("/ping", func(c *gin.Context) {
    c.JSON(200, gin.H{"message": "pong"})
  })

  r.Run()
}
```

Kapsamlı bir güvenlik genel görünümü için [Güvenlik en iyi uygulamaları](/tr/docs/middleware/security-guide/) sayfasına bakın.

### Statik dosyaları nasıl sunarım?

Statik dosyaları sunmak için `Static()` veya `StaticFS()` kullanın:

```go
func main() {
  r := gin.Default()

  // Serve files from ./assets directory at /assets/*
  r.Static("/assets", "./assets")

  // Serve a single file
  r.StaticFile("/favicon.ico", "./resources/favicon.ico")

  // Serve from embedded filesystem (Go 1.16+)
  r.StaticFS("/public", http.FS(embedFS))

  r.Run()
}
```

Daha fazla ayrıntı için [Dosyadan veri sunma](/tr/docs/rendering/serving-data-from-file/) sayfasına bakın.

### Dosya yüklemelerini nasıl yönetirim?

Tekli dosyalar için `FormFile()`, birden fazla dosya için `MultipartForm()` kullanın:

```go
// Single file upload
r.POST("/upload", func(c *gin.Context) {
  file, _ := c.FormFile("file")
  c.SaveUploadedFile(file, "./uploads/"+file.Filename)
  c.String(200, "File %s uploaded successfully", file.Filename)
})

// Multiple files upload
r.POST("/upload-multiple", func(c *gin.Context) {
  form, _ := c.MultipartForm()
  files := form.File["files"]

  for _, file := range files {
    c.SaveUploadedFile(file, "./uploads/"+file.Filename)
  }
  c.String(200, "%d files uploaded", len(files))
})
```

Daha fazla ayrıntı için [Dosya yükleme](/tr/docs/routing/upload-file/) belgelerine bakın.

### JWT ile kimlik doğrulamayı nasıl uygularım?

[gin-contrib/jwt](https://github.com/gin-contrib/jwt) kullanın veya özel ara katman uygulayın. İşte minimal bir örnek:

```go
package main

import (
  "net/http"
  "time"

  "github.com/gin-gonic/gin"
  "github.com/golang-jwt/jwt/v5"
)

var jwtSecret = []byte("your-secret-key")

type Claims struct {
  Username string `json:"username"`
  jwt.RegisteredClaims
}

func AuthMiddleware() gin.HandlerFunc {
  return func(c *gin.Context) {
    tokenString := c.GetHeader("Authorization")
    if tokenString == "" {
      c.JSON(http.StatusUnauthorized, gin.H{"error": "Missing authorization token"})
      c.Abort()
      return
    }

    // Remove "Bearer " prefix if present
    if len(tokenString) > 7 && tokenString[:7] == "Bearer " {
      tokenString = tokenString[7:]
    }

    token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
      return jwtSecret, nil
    })

    if err != nil || !token.Valid {
      c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
      c.Abort()
      return
    }

    if claims, ok := token.Claims.(*Claims); ok {
      c.Set("username", claims.Username)
      c.Next()
    }
  }
}
```

Oturum tabanlı kimlik doğrulama için [Oturum yönetimi](/tr/docs/middleware/session-management/) sayfasına bakın.

### İstek loglamayı nasıl ayarlarım?

Gin, `gin.Default()` aracılığıyla varsayılan bir logger ara katmanı içerir. Üretimde yapılandırılmış JSON loglama için [Yapılandırılmış loglama](/tr/docs/logging/structured-logging/) sayfasına bakın.

Temel log özelleştirmesi için:

```go
r := gin.New()
r.Use(gin.LoggerWithConfig(gin.LoggerConfig{
  SkipPaths: []string{"/healthz"},
}))
r.Use(gin.Recovery())
```

Özel formatlar, dosya çıktısı ve sorgu dizelerini atlama dahil tüm seçenekler için [Loglama](/tr/docs/logging/) bölümüne bakın.

### Zarif kapatmayı nasıl yönetirim?

Kod örnekleri içeren kapsamlı bir kılavuz için [Zarif yeniden başlatma veya durdurma](/tr/docs/server-config/graceful-restart-or-stop/) sayfasına bakın.

### Neden "405 Method Not Allowed" yerine "404 Not Found" alıyorum?

Varsayılan olarak Gin, istenen HTTP yöntemini desteklemeyen rotalar için 404 döndürür. Bunun yerine 405 döndürmek için `HandleMethodNotAllowed = true` ayarlayın:

```go
r := gin.Default()
r.HandleMethodNotAllowed = true

r.GET("/ping", func(c *gin.Context) {
  c.JSON(200, gin.H{"message": "pong"})
})

r.Run()
```

```sh
$ curl -X POST localhost:8080/ping

HTTP/1.1 405 Method Not Allowed
Allow: GET
```

### Sorgu parametreleri ve POST verilerini birlikte nasıl bağlarım?

İçerik türüne göre otomatik olarak bağlama seçen `ShouldBind()` kullanın:

```go
type User struct {
  Name  string `form:"name" json:"name"`
  Email string `form:"email" json:"email"`
  Page  int    `form:"page"`
}

r.POST("/user", func(c *gin.Context) {
  var user User
  if err := c.ShouldBind(&user); err != nil {
    c.JSON(400, gin.H{"error": err.Error()})
    return
  }
  c.JSON(200, user)
})
```

Tüm bağlama seçenekleri için [Bağlama](/tr/docs/binding/) bölümüne bakın.

### İstek verilerini nasıl doğrularım?

Gin, doğrulama için [go-playground/validator](https://github.com/go-playground/validator) kullanır. Struct'larınıza doğrulama etiketleri ekleyin:

```go
type User struct {
  Name  string `json:"name" binding:"required,min=3,max=50"`
  Email string `json:"email" binding:"required,email"`
  Age   int    `json:"age" binding:"gte=0,lte=130"`
}

r.POST("/user", func(c *gin.Context) {
  var user User
  if err := c.ShouldBindJSON(&user); err != nil {
    c.JSON(400, gin.H{"error": err.Error()})
    return
  }
  c.JSON(200, gin.H{"message": "User is valid"})
})
```

Özel doğrulayıcılar ve gelişmiş kullanım için [Model bağlama ve doğrulama](/tr/docs/binding/binding-and-validation/) sayfasına bakın.

### Gin'i üretim modunda nasıl çalıştırırım?

`GIN_MODE` ortam değişkenini `release` olarak ayarlayın:

```sh
export GIN_MODE=release
# veya
GIN_MODE=release ./your-app
```

Veya programatik olarak ayarlayın:

```go
gin.SetMode(gin.ReleaseMode)
```

Release modu hata ayıklama loglamasını devre dışı bırakır ve performansı artırır.

### Gin ile veritabanı bağlantılarını nasıl yönetirim?

`database/sql`, GORM, bağlantı havuzlama ve bağımlılık enjeksiyonu kalıplarını kapsayan kapsamlı bir kılavuz için [Veritabanı entegrasyonu](/tr/docs/server-config/database/) sayfasına bakın.

### Gin işleyicilerini nasıl test ederim?

Rotalarınızı test etmek için `net/http/httptest` kullanın:

```go
func TestPingRoute(t *testing.T) {
  router := gin.Default()
  router.GET("/ping", func(c *gin.Context) {
    c.JSON(200, gin.H{"message": "pong"})
  })

  w := httptest.NewRecorder()
  req, _ := http.NewRequest("GET", "/ping", nil)
  router.ServeHTTP(w, req)

  assert.Equal(t, 200, w.Code)
  assert.Contains(t, w.Body.String(), "pong")
}
```

Daha fazla örnek için [Test](/tr/docs/testing/) belgelerine bakın.

## Performans Soruları

### Gin'i yüksek trafik için nasıl optimize ederim?

1. **Release Modunu Kullanın**: `GIN_MODE=release` ayarlayın
2. **Gereksiz ara katmanları devre dışı bırakın**: Yalnızca ihtiyacınız olanı kullanın
3. **Manuel ara katman kontrolü için `gin.Default()` yerine `gin.New()` kullanın**
4. **Bağlantı havuzlama**: Veritabanı bağlantı havuzlarını yapılandırın ([Veritabanı entegrasyonu](/tr/docs/server-config/database/) bakın)
5. **Önbellekleme**: Sık erişilen veriler için önbellekleme uygulayın
6. **Yük dengeleme**: Ters proxy kullanın (nginx, HAProxy)
7. **Profilleme**: Darboğazları belirlemek için Go'nun pprof'unu kullanın
8. **İzleme**: Performansı takip etmek için [metrikler ve izleme](/tr/docs/server-config/metrics/) ayarlayın

### Gin üretime hazır mı?

Evet. Gin birçok şirket tarafından üretimde kullanılmaktadır ve ölçekte savaş testinden geçmiştir. Gin'i üretimde kullanan projelerin örnekleri için [Kullanıcılar](/tr/docs/users/) sayfasına bakın.

## Sorun Giderme

### Rota parametrelerim neden çalışmıyor?

Rota parametrelerinin `:` sözdizimini kullandığından ve düzgün şekilde çıkarıldığından emin olun:

```go
// Correct
r.GET("/user/:id", func(c *gin.Context) {
  id := c.Param("id")
  c.String(200, "User ID: %s", id)
})

// Not: /user/{id} or /user/<id>
```

Ayrıntılar için [Yol parametreleri](/tr/docs/routing/param-in-path/) sayfasına bakın.

### Ara katmanım neden çalışmıyor?

Ara katman, rotalardan veya rota gruplarından önce kaydedilmelidir:

```go
// Correct order
r := gin.New()
r.Use(MyMiddleware()) // Register middleware first
r.GET("/ping", handler) // Then routes

// For route groups
auth := r.Group("/admin")
auth.Use(AuthMiddleware()) // Middleware for this group
{
  auth.GET("/dashboard", handler)
}
```

Ayrıntılar için [Ara katman kullanımı](/tr/docs/middleware/using-middleware/) sayfasına bakın.

### İstek bağlama neden başarısız oluyor?

Yaygın nedenler:

1. **Eksik bağlama etiketleri**: `json:"field"` veya `form:"field"` etiketleri ekleyin
2. **Content-Type uyumsuzluğu**: İstemcinin doğru Content-Type başlığını gönderdiğinden emin olun
3. **Doğrulama hataları**: Doğrulama etiketlerini ve gereksinimleri kontrol edin
4. **Dışa aktarılmamış alanlar**: Yalnızca dışa aktarılmış (büyük harfle başlayan) struct alanları bağlanır

```go
type User struct {
  Name  string `json:"name" binding:"required"` // ✓ Correct
  Email string `json:"email"`                    // ✓ Correct
  age   int    `json:"age"`                      // ✗ Won't bind (unexported)
}
```

Ayrıntılar için [Model bağlama ve doğrulama](/tr/docs/binding/binding-and-validation/) sayfasına bakın.
