---
title: "Manajemen Session"
sidebar:
  order: 9
---

Session memungkinkan Anda menyimpan data spesifik pengguna di seluruh permintaan HTTP. Karena HTTP bersifat stateless, session menggunakan cookie atau mekanisme lain untuk mengidentifikasi pengguna yang kembali dan mengambil data tersimpan mereka.

## Menggunakan gin-contrib/sessions

Middleware [gin-contrib/sessions](https://github.com/gin-contrib/sessions) menyediakan manajemen session dengan beberapa backend penyimpanan:

```sh
go get github.com/gin-contrib/sessions
```

### Session berbasis cookie

Pendekatan paling sederhana menyimpan data session dalam cookie terenkripsi:

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

### Session berbasis Redis

Untuk aplikasi produksi, simpan session di Redis untuk skalabilitas lintas beberapa instance:

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

## Opsi session

Konfigurasikan perilaku session dengan `sessions.Options`:

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

| Opsi | Deskripsi |
|------|-----------|
| `Path` | Cakupan path cookie (default: `/`) |
| `MaxAge` | Masa hidup dalam detik. Gunakan `-1` untuk menghapus, `0` untuk session browser |
| `HttpOnly` | Mencegah akses JavaScript ke cookie |
| `Secure` | Hanya kirim cookie melalui HTTPS |
| `SameSite` | Mengontrol perilaku cookie cross-site (`Lax`, `Strict`, `None`) |

:::note
Selalu atur `HttpOnly: true` dan `Secure: true` di produksi untuk melindungi cookie session dari serangan XSS dan man-in-the-middle.
:::

## Backend yang tersedia

| Backend | Paket | Kasus penggunaan |
|---------|-------|------------------|
| Cookie | `sessions/cookie` | Aplikasi sederhana, data session kecil |
| Redis | `sessions/redis` | Produksi, deployment multi-instance |
| Memcached | `sessions/memcached` | Lapisan caching berperforma tinggi |
| MongoDB | `sessions/mongo` | Ketika MongoDB adalah datastore utama Anda |
| PostgreSQL | `sessions/postgres` | Ketika PostgreSQL adalah datastore utama Anda |

## Session vs JWT

| Aspek | Session | JWT |
|-------|---------|-----|
| Penyimpanan | Sisi server (Redis, DB) | Sisi klien (token) |
| Pencabutan | Mudah (hapus dari store) | Sulit (memerlukan blocklist) |
| Skalabilitas | Memerlukan store bersama | Stateless |
| Ukuran data | Tidak terbatas di sisi server | Dibatasi oleh ukuran token |

Gunakan session ketika Anda memerlukan pencabutan yang mudah (mis., logout, ban pengguna). Gunakan JWT ketika Anda memerlukan autentikasi stateless lintas microservice.

## Lihat juga

- [Penanganan cookie](/id/docs/server-config/cookie/)
- [Praktik terbaik keamanan](/id/docs/middleware/security-guide/)
- [Menggunakan middleware](/id/docs/middleware/using-middleware/)
