---
title: "Praktik Terbaik Keamanan"
sidebar:
  order: 8
---

Aplikasi web adalah target utama penyerang. Aplikasi Gin yang menangani input pengguna, menyimpan data, atau berjalan di balik reverse proxy memerlukan konfigurasi keamanan yang disengaja sebelum masuk ke produksi. Panduan ini mencakup pertahanan paling penting dan menunjukkan cara menerapkan masing-masing dengan middleware Gin dan pustaka standar Go.

:::note
Keamanan berlapis. Tidak ada satu teknik pun dalam daftar ini yang cukup dengan sendirinya. Terapkan semua bagian yang relevan untuk membangun pertahanan berlapis.
:::

## Konfigurasi CORS

Cross-Origin Resource Sharing (CORS) mengontrol domain eksternal mana yang dapat membuat permintaan ke API Anda. CORS yang salah dikonfigurasi dapat memungkinkan situs web berbahaya membaca respons dari server Anda atas nama pengguna yang terautentikasi.

Gunakan paket [`gin-contrib/cors`](https://github.com/gin-contrib/cors) untuk solusi yang teruji dengan baik.

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
Jangan pernah menggunakan `AllowOrigins: []string{"*"}` bersamaan dengan `AllowCredentials: true`. Ini memberitahu browser bahwa situs mana pun dapat membuat permintaan terautentikasi ke API Anda.
:::

## Perlindungan CSRF

Cross-Site Request Forgery mengelabui browser pengguna yang terautentikasi untuk mengirim permintaan yang tidak diinginkan ke aplikasi Anda. Setiap endpoint yang mengubah state (POST, PUT, DELETE) yang mengandalkan cookie untuk autentikasi memerlukan perlindungan CSRF.

Gunakan middleware [`gin-contrib/csrf`](https://github.com/gin-contrib/csrf) untuk menambahkan perlindungan berbasis token.

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
Perlindungan CSRF sangat penting untuk aplikasi yang menggunakan autentikasi berbasis cookie. API yang hanya mengandalkan header `Authorization` (mis., Bearer token) tidak rentan terhadap CSRF karena browser tidak melampirkan header tersebut secara otomatis.
:::

## Rate limiting

Rate limiting mencegah penyalahgunaan, serangan brute-force, dan kehabisan sumber daya. Anda dapat menggunakan paket `golang.org/x/time/rate` dari pustaka standar untuk membuat rate limiter per-klien sederhana sebagai middleware.

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
Contoh di atas menyimpan limiter dalam map in-memory. Di produksi, Anda harus menambahkan pembersihan berkala untuk entri yang sudah basi dan mempertimbangkan rate limiter terdistribusi (mis., berbasis Redis) jika Anda menjalankan beberapa instance aplikasi.
:::

## Validasi input dan pencegahan SQL injection

Selalu validasi dan ikat input menggunakan model binding Gin dengan tag struct. Jangan pernah membuat query SQL dengan menggabungkan input pengguna.

### Validasi input dengan tag struct

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

### Gunakan query berparameter

```go
// DANGEROUS -- SQL injection vulnerability
row := db.QueryRow("SELECT id FROM users WHERE username = '" + username + "'")

// SAFE -- parameterized query
row := db.QueryRow("SELECT id FROM users WHERE username = $1", username)
```

Ini berlaku untuk setiap pustaka database. Baik Anda menggunakan `database/sql`, GORM, sqlx, atau ORM lainnya, selalu gunakan placeholder parameter dan jangan pernah penggabungan string.

:::note
Validasi input dan query berparameter adalah dua pertahanan terpenting Anda terhadap serangan injeksi. Keduanya saja tidak cukup -- gunakan keduanya.
:::

## Pencegahan XSS

Cross-Site Scripting (XSS) terjadi ketika penyerang menyuntikkan skrip berbahaya yang dieksekusi di browser pengguna lain. Pertahankan dari ini di beberapa lapisan.

### Escape output HTML

Saat merender template HTML, paket `html/template` Go meng-escape output secara default. Jika Anda mengembalikan data yang diberikan pengguna sebagai JSON, pastikan header `Content-Type` diatur dengan benar agar browser tidak menginterpretasikan JSON sebagai HTML.

```go
// Gin sets Content-Type automatically for JSON responses.
// Use c.JSON, not c.String, when returning structured data.
c.JSON(200, gin.H{"input": userInput})
```

### Gunakan SecureJSON untuk perlindungan JSONP

Gin menyediakan `c.SecureJSON` yang menambahkan `while(1);` di depan untuk mencegah JSON hijacking.

```go
c.SecureJSON(200, gin.H{"data": userInput})
```

### Atur Content-Type secara eksplisit saat diperlukan

```go
// For API endpoints, always return JSON
c.Header("Content-Type", "application/json; charset=utf-8")
c.Header("X-Content-Type-Options", "nosniff")
```

Header `X-Content-Type-Options: nosniff` mencegah browser melakukan MIME-type sniffing, yang menghentikan mereka dari menginterpretasikan respons sebagai HTML ketika server mendeklarasikannya sebagai sesuatu yang lain.

## Middleware header keamanan

Menambahkan header keamanan adalah salah satu langkah penguatan paling sederhana dan efektif. Lihat halaman lengkap [Header Keamanan](/id/docs/middleware/security-headers/) untuk contoh detail. Di bawah ini adalah ringkasan singkat header esensial.

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

| Header | Apa yang dicegah |
|--------|-----------------|
| `X-Frame-Options: DENY` | Clickjacking via iframe |
| `X-Content-Type-Options: nosniff` | Serangan MIME-type sniffing |
| `Strict-Transport-Security` | Downgrade protokol dan pembajakan cookie |
| `Content-Security-Policy` | XSS dan injeksi data |
| `Referrer-Policy` | Kebocoran parameter URL sensitif ke pihak ketiga |
| `Permissions-Policy` | Penggunaan tidak sah API browser (kamera, mikrofon, dll.) |

## Proxy tepercaya

Ketika aplikasi Anda berjalan di balik reverse proxy atau load balancer, Anda harus memberitahu Gin proxy mana yang dipercaya. Tanpa konfigurasi ini, penyerang dapat memalsukan header `X-Forwarded-For` untuk melewati kontrol akses berbasis IP dan rate limiting.

```go
// Trust only your known proxy addresses
router.SetTrustedProxies([]string{"10.0.0.1", "192.168.1.0/24"})
```

Lihat halaman [Proxy Tepercaya](/id/docs/server-config/trusted-proxies/) untuk penjelasan lengkap dan opsi konfigurasi.

## HTTPS dan TLS

Semua aplikasi Gin produksi harus melayani lalu lintas melalui HTTPS. Gin mendukung sertifikat TLS otomatis melalui Let's Encrypt.

```go
import "github.com/gin-gonic/autotls"

func main() {
  r := gin.Default()
  // ... routes ...
  log.Fatal(autotls.Run(r, "example.com"))
}
```

Lihat halaman [Dukungan Let's Encrypt](/id/docs/server-config/support-lets-encrypt/) untuk instruksi setup lengkap termasuk manajer sertifikat kustom.

:::note
Selalu kombinasikan HTTPS dengan header `Strict-Transport-Security` (HSTS) untuk mencegah serangan downgrade protokol. Setelah header HSTS diatur, browser akan menolak untuk terhubung melalui HTTP biasa.
:::

## Lihat juga

- [Header Keamanan](/id/docs/middleware/security-headers/)
- [Proxy Tepercaya](/id/docs/server-config/trusted-proxies/)
- [Dukungan Let's Encrypt](/id/docs/server-config/support-lets-encrypt/)
- [Middleware Kustom](/id/docs/middleware/custom-middleware/)
- [Binding dan Validasi](/id/docs/binding/binding-and-validation/)
