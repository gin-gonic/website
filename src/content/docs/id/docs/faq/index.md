---
title: "Pertanyaan Umum"
sidebar:
  order: 15
---

## Pertanyaan Umum

### Bagaimana cara mengaktifkan live reload selama pengembangan?

Gunakan [Air](https://github.com/air-verse/air) untuk live reloading otomatis selama pengembangan. Air memantau file Anda dan membangun ulang/memulai ulang aplikasi Anda ketika perubahan terdeteksi.

**Instalasi:**

```sh
go install github.com/air-verse/air@latest
```

**Pengaturan:**

Buat file konfigurasi `.air.toml` di root proyek Anda:

```sh
air init
```

Lalu jalankan `air` di direktori proyek Anda alih-alih `go run`:

```sh
air
```

Air akan memantau file `.go` Anda dan secara otomatis membangun ulang/memulai ulang aplikasi Gin Anda saat ada perubahan. Lihat [dokumentasi Air](https://github.com/air-verse/air) untuk opsi konfigurasi.

### Bagaimana cara menangani CORS di Gin?

Gunakan middleware resmi [gin-contrib/cors](https://github.com/gin-contrib/cors):

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

Untuk gambaran keamanan lengkap, lihat [Praktik terbaik keamanan](/id/docs/middleware/security-guide/).

### Bagaimana cara menyajikan file statis?

Gunakan `Static()` atau `StaticFS()` untuk menyajikan file statis:

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

Lihat [Menyajikan data dari file](/id/docs/rendering/serving-data-from-file/) untuk detail lebih lanjut.

### Bagaimana cara menangani upload file?

Gunakan `FormFile()` untuk file tunggal atau `MultipartForm()` untuk banyak file:

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

Lihat dokumentasi [Upload file](/id/docs/routing/upload-file/) untuk detail lebih lanjut.

### Bagaimana cara mengimplementasikan autentikasi dengan JWT?

Gunakan [gin-contrib/jwt](https://github.com/gin-contrib/jwt) atau implementasikan middleware kustom. Berikut contoh minimal:

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

Untuk autentikasi berbasis session, lihat [Manajemen session](/id/docs/middleware/session-management/).

### Bagaimana cara mengatur logging permintaan?

Gin menyertakan middleware logger default melalui `gin.Default()`. Untuk logging JSON terstruktur di produksi, lihat [Logging terstruktur](/id/docs/logging/structured-logging/).

Untuk kustomisasi log dasar:

```go
r := gin.New()
r.Use(gin.LoggerWithConfig(gin.LoggerConfig{
  SkipPaths: []string{"/healthz"},
}))
r.Use(gin.Recovery())
```

Lihat bagian [Logging](/id/docs/logging/) untuk semua opsi termasuk format kustom, output file, dan melewati query string.

### Bagaimana cara menangani shutdown graceful?

Lihat [Restart atau stop graceful](/id/docs/server-config/graceful-restart-or-stop/) untuk panduan lengkap dengan contoh kode.

### Mengapa saya mendapatkan "404 Not Found" alih-alih "405 Method Not Allowed"?

Secara default, Gin mengembalikan 404 untuk rute yang tidak mendukung metode HTTP yang diminta. Atur `HandleMethodNotAllowed = true` untuk mengembalikan 405 sebagai gantinya:

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

### Bagaimana cara mengikat parameter query dan data POST bersamaan?

Gunakan `ShouldBind()` yang secara otomatis memilih binding berdasarkan tipe konten:

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

Lihat bagian [Binding](/id/docs/binding/) untuk semua opsi binding.

### Bagaimana cara memvalidasi data permintaan?

Gin menggunakan [go-playground/validator](https://github.com/go-playground/validator) untuk validasi. Tambahkan tag validasi ke struct Anda:

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

Lihat [Binding dan validasi](/id/docs/binding/binding-and-validation/) untuk validator kustom dan penggunaan lanjutan.

### Bagaimana cara menjalankan Gin dalam mode produksi?

Atur variabel lingkungan `GIN_MODE` ke `release`:

```sh
export GIN_MODE=release
# or
GIN_MODE=release ./your-app
```

Atau atur secara programatis:

```go
gin.SetMode(gin.ReleaseMode)
```

Mode release menonaktifkan logging debug dan meningkatkan performa.

### Bagaimana cara menangani koneksi database dengan Gin?

Lihat [Integrasi database](/id/docs/server-config/database/) untuk panduan lengkap yang mencakup `database/sql`, GORM, connection pooling, dan pola dependency injection.

### Bagaimana cara menguji handler Gin?

Gunakan `net/http/httptest` untuk menguji rute Anda:

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

Lihat dokumentasi [Pengujian](/id/docs/testing/) untuk contoh lebih lanjut.

## Pertanyaan Performa

### Bagaimana cara mengoptimalkan Gin untuk lalu lintas tinggi?

1. **Use Release Mode**: Set `GIN_MODE=release`
2. **Disable unnecessary middleware**: Only use what you need
3. **Use `gin.New()` instead of `gin.Default()`** for manual middleware control
4. **Connection pooling**: Configure database connection pools (see [Database integration](/en/docs/server-config/database/))
5. **Caching**: Implement caching for frequently accessed data
6. **Load balancing**: Use reverse proxy (nginx, HAProxy)
7. **Profiling**: Use Go's pprof to identify bottlenecks
8. **Monitoring**: Set up [metrics and monitoring](/en/docs/server-config/metrics/) to track performance

### Apakah Gin siap produksi?

Ya. Gin digunakan di produksi oleh banyak perusahaan dan telah teruji dalam skala besar. Lihat [Pengguna](/id/docs/users/) untuk contoh proyek yang menggunakan Gin di produksi.

## Pemecahan Masalah

### Mengapa parameter rute saya tidak berfungsi?

Pastikan parameter rute menggunakan sintaks `:` dan diekstrak dengan benar:

```go
// Correct
r.GET("/user/:id", func(c *gin.Context) {
  id := c.Param("id")
  c.String(200, "User ID: %s", id)
})

// Not: /user/{id} or /user/<id>
```

Lihat [Parameter di path](/id/docs/routing/param-in-path/) untuk detail.

### Mengapa middleware saya tidak dieksekusi?

Middleware harus didaftarkan sebelum rute atau grup rute:

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

Lihat [Menggunakan middleware](/id/docs/middleware/using-middleware/) untuk detail.

### Mengapa binding permintaan gagal?

Alasan umum:

1. **Tag binding hilang**: Tambahkan tag `json:"field"` atau `form:"field"`
2. **Content-Type tidak cocok**: Pastikan klien mengirim header Content-Type yang benar
3. **Error validasi**: Periksa tag validasi dan persyaratan
4. **Field yang tidak diekspor**: Hanya field struct yang diekspor (huruf kapital) yang diikat

```go
type User struct {
  Name  string `json:"name" binding:"required"` // ✓ Correct
  Email string `json:"email"`                    // ✓ Correct
  age   int    `json:"age"`                      // ✗ Won't bind (unexported)
}
```

Lihat [Binding dan validasi](/id/docs/binding/binding-and-validation/) untuk detail.
