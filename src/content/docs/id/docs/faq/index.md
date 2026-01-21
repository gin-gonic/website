---
title: "FAQ"
sidebar:
  order: 9
---

## Pertanyaan Umum

### Bagaimana cara mengaktifkan live reload saat pengembangan?

Gunakan [Air](https://github.com/air-verse/air) untuk live reload otomatis selama pengembangan. Air memantau file Anda dan secara otomatis membangun ulang/memulai ulang aplikasi saat perubahan terdeteksi.

**Instalasi:**

```sh
# Instal Air secara global
go install github.com/air-verse/air@latest
```

**Pengaturan:**

Buat file konfigurasi `.air.toml` di root proyek Anda:

```sh
air init
```

Ini menghasilkan konfigurasi default. Anda dapat menyesuaikannya untuk proyek Gin Anda:

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

**Penggunaan:**

Cukup jalankan `air` di direktori proyek Anda alih-alih `go run`:

```sh
air
```

Air sekarang akan memantau file `.go` Anda dan secara otomatis membangun ulang/memulai ulang aplikasi Gin Anda saat ada perubahan.

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

  // Konfigurasi CORS default
  r.Use(cors.Default())

  // Atau kustomisasi pengaturan CORS
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

### Bagaimana cara menyajikan file statis?

Gunakan `Static()` atau `StaticFS()` untuk menyajikan file statis:

```go
func main() {
  r := gin.Default()

  // Sajikan file dari direktori ./assets di /assets/*
  r.Static("/assets", "./assets")

  // Sajikan satu file
  r.StaticFile("/favicon.ico", "./resources/favicon.ico")

  // Sajikan dari filesystem tertanam (Go 1.16+)
  r.StaticFS("/public", http.FS(embedFS))

  r.Run()
}
```

Lihat [contoh menyajikan file statis](../examples/serving-static-files/) untuk detail lebih lanjut.

### Bagaimana cara menangani upload file?

Gunakan `FormFile()` untuk file tunggal atau `MultipartForm()` untuk beberapa file:

```go
// Upload file tunggal
r.POST("/upload", func(c *gin.Context) {
  file, _ := c.FormFile("file")

  // Simpan file
  c.SaveUploadedFile(file, "./uploads/"+file.Filename)

  c.String(200, "File %s berhasil diupload", file.Filename)
})

// Upload beberapa file
r.POST("/upload-multiple", func(c *gin.Context) {
  form, _ := c.MultipartForm()
  files := form.File["files"]

  for _, file := range files {
    c.SaveUploadedFile(file, "./uploads/"+file.Filename)
  }

  c.String(200, "%d file diupload", len(files))
})
```

Lihat [contoh upload file](../examples/upload-file/) untuk detail lebih lanjut.

### Bagaimana cara mengimplementasikan autentikasi dengan JWT?

Gunakan [gin-contrib/jwt](https://github.com/gin-contrib/jwt) atau implementasikan middleware kustom:

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
      c.JSON(http.StatusUnauthorized, gin.H{"error": "Token otorisasi tidak ada"})
      c.Abort()
      return
    }

    // Hapus prefix "Bearer " jika ada
    if len(tokenString) > 7 && tokenString[:7] == "Bearer " {
      tokenString = tokenString[7:]
    }

    token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
      return jwtSecret, nil
    })

    if err != nil || !token.Valid {
      c.JSON(http.StatusUnauthorized, gin.H{"error": "Token tidak valid"})
      c.Abort()
      return
    }

    if claims, ok := token.Claims.(*Claims); ok {
      c.Set("username", claims.Username)
      c.Next()
    } else {
      c.JSON(http.StatusUnauthorized, gin.H{"error": "Token claims tidak valid"})
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

    // Validasi kredensial (implementasikan logika Anda sendiri)
    if credentials.Username == "admin" && credentials.Password == "password" {
      token, _ := GenerateToken(credentials.Username)
      c.JSON(http.StatusOK, gin.H{"token": token})
    } else {
      c.JSON(http.StatusUnauthorized, gin.H{"error": "Kredensial tidak valid"})
    }
  })

  // Route yang dilindungi
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

### Bagaimana cara mengatur logging request?

Gin menyertakan middleware logger default. Kustomisasi atau gunakan structured logging:

```go
package main

import (
  "log"
  "time"

  "github.com/gin-gonic/gin"
)

// Middleware logger kustom
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

Untuk logging lebih lanjut, lihat [contoh format log kustom](../examples/custom-log-format/).

### Bagaimana cara menangani graceful shutdown?

Implementasikan graceful shutdown untuk menutup koneksi dengan benar:

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
    c.String(http.StatusOK, "Selamat datang!")
  })

  srv := &http.Server{
    Addr:    ":8080",
    Handler: r,
  }

  // Jalankan server di goroutine
  go func() {
    if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
      log.Fatalf("listen: %s\n", err)
    }
  }()

  // Tunggu sinyal interrupt untuk graceful shutdown server
  quit := make(chan os.Signal, 1)
  signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
  <-quit
  log.Println("Mematikan server...")

  // Beri request yang tertunda 5 detik untuk selesai
  ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
  defer cancel()

  if err := srv.Shutdown(ctx); err != nil {
    log.Fatal("Server dipaksa shutdown:", err)
  }

  log.Println("Server keluar")
}
```

Lihat [contoh graceful restart atau stop](../examples/graceful-restart-or-stop/) untuk detail lebih lanjut.

### Mengapa saya mendapat "404 Not Found" alih-alih "405 Method Not Allowed"?

Secara default, Gin mengembalikan 404 untuk route yang tidak mendukung metode HTTP yang diminta. Untuk mengembalikan 405 Method Not Allowed, aktifkan opsi `HandleMethodNotAllowed`.

Lihat [FAQ Method Not Allowed](./method-not-allowed/) untuk detail.

### Bagaimana cara bind parameter query dan data POST bersamaan?

Gunakan `ShouldBind()` yang secara otomatis memilih binding berdasarkan content type:

```go
type User struct {
  Name  string `form:"name" json:"name"`
  Email string `form:"email" json:"email"`
  Page  int    `form:"page"`
}

r.POST("/user", func(c *gin.Context) {
  var user User
  // Bind parameter query dan request body (JSON/form)
  if err := c.ShouldBind(&user); err != nil {
    c.JSON(400, gin.H{"error": err.Error()})
    return
  }
  c.JSON(200, user)
})
```

Untuk kontrol lebih, lihat [contoh bind query atau post](../examples/bind-query-or-post/).

### Bagaimana cara memvalidasi data request?

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
  c.JSON(200, gin.H{"message": "User valid"})
})
```

Untuk validator kustom, lihat [contoh validator kustom](../examples/custom-validators/).

### Bagaimana cara menjalankan Gin dalam mode production?

Set variabel environment `GIN_MODE` ke `release`:

```sh
export GIN_MODE=release
# atau
GIN_MODE=release ./your-app
```

Atau set secara programatik:

```go
gin.SetMode(gin.ReleaseMode)
```

Mode release:

- Menonaktifkan logging debug
- Meningkatkan performa
- Sedikit mengurangi ukuran binary

### Bagaimana cara menangani koneksi database dengan Gin?

Gunakan dependency injection atau context untuk berbagi koneksi database:

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

  // Metode 1: Pass db ke handler
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

  // Metode 2: Gunakan middleware untuk inject db
  r.Use(func(c *gin.Context) {
    c.Set("db", db)
    c.Next()
  })

  r.Run()
}
```

Untuk ORM, pertimbangkan menggunakan [GORM](https://gorm.io/) dengan Gin.

### Bagaimana cara menguji handler Gin?

Gunakan `net/http/httptest` untuk menguji route Anda:

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

Lihat [dokumentasi testing](../testing/) untuk contoh lebih lanjut.

## Pertanyaan Performa

### Bagaimana cara mengoptimalkan Gin untuk traffic tinggi?

1. **Gunakan mode release**: Set `GIN_MODE=release`
2. **Nonaktifkan middleware yang tidak perlu**: Hanya gunakan yang Anda butuhkan
3. **Gunakan `gin.New()` alih-alih `gin.Default()`** jika Anda ingin kontrol manual atas middleware
4. **Connection pooling**: Konfigurasi connection pool database dengan benar
5. **Caching**: Implementasikan caching untuk data yang sering diakses
6. **Load balancing**: Gunakan reverse proxy (nginx, HAProxy)
7. **Profiling**: Gunakan pprof Go untuk mengidentifikasi bottleneck

```go
r := gin.New()
r.Use(gin.Recovery()) // Hanya gunakan middleware recovery

// Set batas connection pool
db.SetMaxOpenConns(25)
db.SetMaxIdleConns(5)
db.SetConnMaxLifetime(5 * time.Minute)
```

### Apakah Gin siap untuk production?

Ya! Gin digunakan dalam production oleh banyak perusahaan dan telah teruji dalam skala besar. Ini adalah salah satu framework web Go paling populer dengan:

- Pemeliharaan aktif dan komunitas
- Ekosistem middleware yang luas
- Benchmark performa yang sangat baik
- Kompatibilitas mundur yang kuat

## Troubleshooting

### Mengapa parameter route saya tidak berfungsi?

Pastikan parameter route menggunakan sintaks `:` dan diekstrak dengan benar:

```go
// Benar
r.GET("/user/:id", func(c *gin.Context) {
  id := c.Param("id")
  c.String(200, "User ID: %s", id)
})

// Salah: /user/{id} atau /user/<id>
```

### Mengapa middleware saya tidak dieksekusi?

Middleware harus didaftarkan sebelum route atau grup route:

```go
// Urutan yang benar
r := gin.New()
r.Use(MyMiddleware()) // Daftarkan middleware dulu
r.GET("/ping", handler) // Kemudian route

// Untuk grup route
auth := r.Group("/admin")
auth.Use(AuthMiddleware()) // Middleware untuk grup ini
{
  auth.GET("/dashboard", handler)
}
```

### Mengapa binding request gagal?

Alasan umum:

1. **Tag binding hilang**: Tambahkan tag `json:"field"` atau `form:"field"`
2. **Content-Type tidak cocok**: Pastikan client mengirim header Content-Type yang benar
3. **Error validasi**: Periksa tag validasi dan persyaratan
4. **Field tidak diekspor**: Hanya field struct yang diekspor (huruf kapital) yang di-bind

```go
type User struct {
  Name  string `json:"name" binding:"required"` // ✓ Benar
  Email string `json:"email"`                    // ✓ Benar
  age   int    `json:"age"`                      // ✗ Tidak akan di-bind (tidak diekspor)
}
```
