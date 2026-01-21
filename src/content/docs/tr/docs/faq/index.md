---
title: "FAQ"
sidebar:
  order: 9
---

## Genel Sorular

### Geliştirme sırasında canlı yeniden yüklemeyi nasıl etkinleştiririm?

Geliştirme sırasında otomatik canlı yeniden yükleme için [Air](https://github.com/air-verse/air) kullanın. Air dosyalarınızı izler ve değişiklikler algılandığında uygulamanızı otomatik olarak yeniden derler/yeniden başlatır.

**Kurulum:**

```sh
# Air'i global olarak yükleyin
go install github.com/air-verse/air@latest
```

**Kurulum:**

Proje kök dizininizde bir `.air.toml` yapılandırma dosyası oluşturun:

```sh
air init
```

Bu varsayılan bir yapılandırma oluşturur. Gin projeniz için özelleştirebilirsiniz:

```toml
# .air.toml
root = "."
testdata_dir = "testdata"
tmp_dir = "tmp"

[build]
  args_bin = []
  bin = "./tmp/main"
  cmd = "go build -o ./tmp/main ."
  delay = 1000
  exclude_dir = ["assets", "tmp", "vendor", "testdata"]
  exclude_file = []
  exclude_regex = ["_test.go"]
  exclude_unchanged = false
  follow_symlink = false
  full_bin = ""
  include_dir = []
  include_ext = ["go", "tpl", "tmpl", "html"]
  include_file = []
  kill_delay = "0s"
  log = "build-errors.log"
  poll = false
  poll_interval = 0
  rerun = false
  rerun_delay = 500
  send_interrupt = false
  stop_on_error = false

[color]
  app = ""
  build = "yellow"
  main = "magenta"
  runner = "green"
  watcher = "cyan"

[log]
  main_only = false
  time = false

[misc]
  clean_on_exit = false

[screen]
  clear_on_rebuild = false
  keep_scroll = true
```

**Kullanım:**

Proje dizininizde `go run` yerine `air` çalıştırın:

```sh
air
```

Air artık `.go` dosyalarınızı izleyecek ve değişikliklerde Gin uygulamanızı otomatik olarak yeniden derleyip/yeniden başlatacak.

### Gin'de CORS'u nasıl yönetirim?

Resmi [gin-contrib/cors](https://github.com/gin-contrib/cors) middleware'ini kullanın:

```go
package main

import (
  "time"

  "github.com/gin-contrib/cors"
  "github.com/gin-gonic/gin"
)

func main() {
  r := gin.Default()

  // Varsayılan CORS yapılandırması
  r.Use(cors.Default())

  // Veya CORS ayarlarını özelleştirin
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

### Statik dosyaları nasıl sunarım?

Statik dosyaları sunmak için `Static()` veya `StaticFS()` kullanın:

```go
func main() {
  r := gin.Default()

  // /assets/* yolunda ./assets dizinindeki dosyaları sun
  r.Static("/assets", "./assets")

  // Tek bir dosya sun
  r.StaticFile("/favicon.ico", "./resources/favicon.ico")

  // Gömülü dosya sisteminden sun (Go 1.16+)
  r.StaticFS("/public", http.FS(embedFS))

  r.Run()
}
```

Daha fazla ayrıntı için [statik dosya sunma örneğine](../examples/serving-static-files/) bakın.

### Dosya yüklemeyi nasıl yönetirim?

Tek dosya için `FormFile()` veya birden fazla dosya için `MultipartForm()` kullanın:

```go
// Tek dosya yükleme
r.POST("/upload", func(c *gin.Context) {
  file, _ := c.FormFile("file")

  // Dosyayı kaydet
  c.SaveUploadedFile(file, "./uploads/"+file.Filename)

  c.String(200, "Dosya %s başarıyla yüklendi", file.Filename)
})

// Çoklu dosya yükleme
r.POST("/upload-multiple", func(c *gin.Context) {
  form, _ := c.MultipartForm()
  files := form.File["files"]

  for _, file := range files {
    c.SaveUploadedFile(file, "./uploads/"+file.Filename)
  }

  c.String(200, "%d dosya yüklendi", len(files))
})
```

Daha fazla ayrıntı için [dosya yükleme örneklerine](../examples/upload-file/) bakın.

### JWT ile kimlik doğrulamayı nasıl uygularım?

[gin-contrib/jwt](https://github.com/gin-contrib/jwt) kullanın veya özel middleware uygulayın:

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

func GenerateToken(username string) (string, error) {
  claims := Claims{
    Username: username,
    RegisteredClaims: jwt.RegisteredClaims{
      ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
      IssuedAt:  jwt.NewNumericDate(time.Now()),
    },
  }

  token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
  return token.SignedString(jwtSecret)
}

func AuthMiddleware() gin.HandlerFunc {
  return func(c *gin.Context) {
    tokenString := c.GetHeader("Authorization")
    if tokenString == "" {
      c.JSON(http.StatusUnauthorized, gin.H{"error": "Yetkilendirme token'ı eksik"})
      c.Abort()
      return
    }

    // "Bearer " önekini kaldır (varsa)
    if len(tokenString) > 7 && tokenString[:7] == "Bearer " {
      tokenString = tokenString[7:]
    }

    token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
      return jwtSecret, nil
    })

    if err != nil || !token.Valid {
      c.JSON(http.StatusUnauthorized, gin.H{"error": "Geçersiz token"})
      c.Abort()
      return
    }

    if claims, ok := token.Claims.(*Claims); ok {
      c.Set("username", claims.Username)
      c.Next()
    } else {
      c.JSON(http.StatusUnauthorized, gin.H{"error": "Geçersiz token claims"})
      c.Abort()
    }
  }
}

func main() {
  r := gin.Default()

  r.POST("/login", func(c *gin.Context) {
    var credentials struct {
      Username string `json:"username"`
      Password string `json:"password"`
    }

    if err := c.BindJSON(&credentials); err != nil {
      c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      return
    }

    // Kimlik bilgilerini doğrula (kendi mantığınızı uygulayın)
    if credentials.Username == "admin" && credentials.Password == "password" {
      token, _ := GenerateToken(credentials.Username)
      c.JSON(http.StatusOK, gin.H{"token": token})
    } else {
      c.JSON(http.StatusUnauthorized, gin.H{"error": "Geçersiz kimlik bilgileri"})
    }
  })

  // Korumalı rotalar
  authorized := r.Group("/")
  authorized.Use(AuthMiddleware())
  {
    authorized.GET("/profile", func(c *gin.Context) {
      username := c.MustGet("username").(string)
      c.JSON(http.StatusOK, gin.H{"username": username})
    })
  }

  r.Run()
}
```

### İstek günlüğünü nasıl ayarlarım?

Gin varsayılan bir logger middleware içerir. Özelleştirin veya yapılandırılmış günlük kullanın:

```go
package main

import (
  "log"
  "time"

  "github.com/gin-gonic/gin"
)

// Özel logger middleware
func Logger() gin.HandlerFunc {
  return func(c *gin.Context) {
    start := time.Now()
    path := c.Request.URL.Path

    c.Next()

    latency := time.Since(start)
    statusCode := c.Writer.Status()
    clientIP := c.ClientIP()
    method := c.Request.Method

    log.Printf("[GIN] %s | %3d | %13v | %15s | %-7s %s",
      time.Now().Format("2006/01/02 - 15:04:05"),
      statusCode,
      latency,
      clientIP,
      method,
      path,
    )
  }
}

func main() {
  r := gin.New()
  r.Use(Logger())
  r.Use(gin.Recovery())

  r.GET("/ping", func(c *gin.Context) {
    c.JSON(200, gin.H{"message": "pong"})
  })

  r.Run()
}
```

Daha gelişmiş günlükleme için [özel günlük formatı örneğine](../examples/custom-log-format/) bakın.

### Graceful shutdown'u nasıl yönetirim?

Bağlantıları düzgün kapatmak için graceful shutdown uygulayın:

```go
package main

import (
  "context"
  "log"
  "net/http"
  "os"
  "os/signal"
  "syscall"
  "time"

  "github.com/gin-gonic/gin"
)

func main() {
  r := gin.Default()

  r.GET("/", func(c *gin.Context) {
    time.Sleep(5 * time.Second)
    c.String(http.StatusOK, "Hoş geldiniz!")
  })

  srv := &http.Server{
    Addr:    ":8080",
    Handler: r,
  }

  // Sunucuyu goroutine'de çalıştır
  go func() {
    if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
      log.Fatalf("dinleme: %s\n", err)
    }
  }()

  // Sunucuyu graceful şekilde kapatmak için kesme sinyalini bekle
  quit := make(chan os.Signal, 1)
  signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
  <-quit
  log.Println("Sunucu kapatılıyor...")

  // Bekleyen isteklere tamamlanmaları için 5 saniye ver
  ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
  defer cancel()

  if err := srv.Shutdown(ctx); err != nil {
    log.Fatal("Sunucu zorla kapatıldı:", err)
  }

  log.Println("Sunucu sonlandı")
}
```

Daha fazla ayrıntı için [graceful restart veya stop örneğine](../examples/graceful-restart-or-stop/) bakın.

### Neden "405 Method Not Allowed" yerine "404 Not Found" alıyorum?

Varsayılan olarak, Gin istenen HTTP yöntemini desteklemeyen rotalar için 404 döndürür. 405 Method Not Allowed döndürmek için `HandleMethodNotAllowed` seçeneğini etkinleştirin.

Ayrıntılar için [Method Not Allowed FAQ](./method-not-allowed/) sayfasına bakın.

### Sorgu parametrelerini ve POST verilerini birlikte nasıl bağlarım?

İçerik türüne göre bağlamayı otomatik olarak seçen `ShouldBind()` kullanın:

```go
type User struct {
  Name  string `form:"name" json:"name"`
  Email string `form:"email" json:"email"`
  Page  int    `form:"page"`
}

r.POST("/user", func(c *gin.Context) {
  var user User
  // Sorgu parametrelerini ve istek gövdesini (JSON/form) bağla
  if err := c.ShouldBind(&user); err != nil {
    c.JSON(400, gin.H{"error": err.Error()})
    return
  }
  c.JSON(200, user)
})
```

Daha fazla kontrol için [sorgu veya post bağlama örneğine](../examples/bind-query-or-post/) bakın.

### İstek verilerini nasıl doğrularım?

Gin doğrulama için [go-playground/validator](https://github.com/go-playground/validator) kullanır. Struct'larınıza doğrulama etiketleri ekleyin:

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
  c.JSON(200, gin.H{"message": "Kullanıcı geçerli"})
})
```

Özel doğrulayıcılar için [özel doğrulayıcılar örneğine](../examples/custom-validators/) bakın.

### Gin'i production modunda nasıl çalıştırırım?

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

Release modu:

- Hata ayıklama günlüğünü devre dışı bırakır
- Performansı artırır
- Binary boyutunu biraz azaltır

### Gin ile veritabanı bağlantılarını nasıl yönetirim?

Veritabanı bağlantılarını paylaşmak için bağımlılık enjeksiyonu veya context kullanın:

```go
package main

import (
  "database/sql"

  "github.com/gin-gonic/gin"
  _ "github.com/lib/pq"
)

func main() {
  db, err := sql.Open("postgres", "postgres://user:pass@localhost/dbname")
  if err != nil {
    panic(err)
  }
  defer db.Close()

  r := gin.Default()

  // Yöntem 1: db'yi handler'lara geç
  r.GET("/users", func(c *gin.Context) {
    var users []string
    rows, _ := db.Query("SELECT name FROM users")
    defer rows.Close()

    for rows.Next() {
      var name string
      rows.Scan(&name)
      users = append(users, name)
    }

    c.JSON(200, users)
  })

  // Yöntem 2: db enjekte etmek için middleware kullan
  r.Use(func(c *gin.Context) {
    c.Set("db", db)
    c.Next()
  })

  r.Run()
}
```

ORM'ler için Gin ile [GORM](https://gorm.io/) kullanmayı düşünün.

### Gin handler'larını nasıl test ederim?

Rotalarınızı test etmek için `net/http/httptest` kullanın:

```go
package main

import (
  "net/http"
  "net/http/httptest"
  "testing"

  "github.com/gin-gonic/gin"
  "github.com/stretchr/testify/assert"
)

func SetupRouter() *gin.Engine {
  r := gin.Default()
  r.GET("/ping", func(c *gin.Context) {
    c.JSON(200, gin.H{"message": "pong"})
  })
  return r
}

func TestPingRoute(t *testing.T) {
  router := SetupRouter()

  w := httptest.NewRecorder()
  req, _ := http.NewRequest("GET", "/ping", nil)
  router.ServeHTTP(w, req)

  assert.Equal(t, 200, w.Code)
  assert.Contains(t, w.Body.String(), "pong")
}
```

Daha fazla örnek için [test dokümantasyonuna](../testing/) bakın.

## Performans Soruları

### Yüksek trafik için Gin'i nasıl optimize ederim?

1. **Release modunu kullanın**: `GIN_MODE=release` ayarlayın
2. **Gereksiz middleware'i devre dışı bırakın**: Sadece ihtiyacınız olanı kullanın
3. **Middleware üzerinde manuel kontrol istiyorsanız `gin.Default()` yerine `gin.New()` kullanın**
4. **Bağlantı havuzu**: Veritabanı bağlantı havuzlarını düzgün yapılandırın
5. **Önbellek**: Sık erişilen veriler için önbellek uygulayın
6. **Yük dengeleme**: Reverse proxy (nginx, HAProxy) kullanın
7. **Profilleme**: Darboğazları belirlemek için Go'nun pprof'unu kullanın

```go
r := gin.New()
r.Use(gin.Recovery()) // Sadece recovery middleware kullan

// Bağlantı havuzu limitlerini ayarla
db.SetMaxOpenConns(25)
db.SetMaxIdleConns(5)
db.SetConnMaxLifetime(5 * time.Minute)
```

### Gin production için hazır mı?

Evet! Gin birçok şirket tarafından production'da kullanılmaktadır ve ölçekte savaş testi yapılmıştır. En popüler Go web framework'lerinden biridir:

- Aktif bakım ve topluluk
- Kapsamlı middleware ekosistemi
- Mükemmel performans benchmarkları
- Güçlü geriye dönük uyumluluk

## Sorun Giderme

### Rota parametrelerim neden çalışmıyor?

Rota parametrelerinin `:` sözdizimini kullandığından ve düzgün çıkarıldığından emin olun:

```go
// Doğru
r.GET("/user/:id", func(c *gin.Context) {
  id := c.Param("id")
  c.String(200, "Kullanıcı ID: %s", id)
})

// Yanlış: /user/{id} veya /user/<id>
```

### Middleware'm neden çalışmıyor?

Middleware rotalardan veya rota gruplarından önce kaydedilmelidir:

```go
// Doğru sıra
r := gin.New()
r.Use(MyMiddleware()) // Önce middleware kaydet
r.GET("/ping", handler) // Sonra rotalar

// Rota grupları için
auth := r.Group("/admin")
auth.Use(AuthMiddleware()) // Bu grup için middleware
{
  auth.GET("/dashboard", handler)
}
```

### İstek bağlama neden başarısız oluyor?

Yaygın nedenler:

1. **Bağlama etiketleri eksik**: `json:"field"` veya `form:"field"` etiketleri ekleyin
2. **Content-Type uyumsuzluğu**: İstemcinin doğru Content-Type başlığı gönderdiğinden emin olun
3. **Doğrulama hataları**: Doğrulama etiketlerini ve gereksinimleri kontrol edin
4. **Export edilmemiş alanlar**: Sadece export edilmiş (büyük harfle başlayan) struct alanları bağlanır

```go
type User struct {
  Name  string `json:"name" binding:"required"` // ✓ Doğru
  Email string `json:"email"`                    // ✓ Doğru
  age   int    `json:"age"`                      // ✗ Bağlanmayacak (export edilmemiş)
}
```
