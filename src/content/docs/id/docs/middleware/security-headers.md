---
title: "Header Keamanan"
sidebar:
  order: 7
---

Penting untuk menggunakan header keamanan untuk melindungi aplikasi web Anda dari kerentanan keamanan umum. Contoh ini menunjukkan cara menambahkan header keamanan ke aplikasi Gin Anda dan juga cara menghindari serangan terkait Host Header Injection (SSRF, Open Redirection).

### Apa yang dilindungi setiap header

| Header | Tujuan |
|--------|--------|
| `X-Content-Type-Options: nosniff` | Mencegah serangan MIME-type sniffing. Tanpa header ini, browser dapat menginterpretasikan file sebagai tipe konten yang berbeda dari yang dinyatakan, memungkinkan penyerang mengeksekusi skrip berbahaya yang disamarkan sebagai tipe file yang tidak berbahaya (mis., mengupload `.jpg` yang sebenarnya JavaScript). |
| `X-Frame-Options: DENY` | Mencegah clickjacking dengan menonaktifkan halaman dari dimuat di dalam `<iframe>`. Penyerang menggunakan clickjacking untuk melapisi frame tak terlihat di atas halaman yang sah, mengelabui pengguna untuk mengklik tombol tersembunyi (mis., "Hapus akun saya"). |
| `Content-Security-Policy` | Mengontrol sumber daya mana (skrip, style, gambar, font, dll.) yang diizinkan browser untuk dimuat dan dari origin mana. Ini adalah salah satu pertahanan paling efektif terhadap Cross-Site Scripting (XSS) karena dapat memblokir skrip inline dan membatasi sumber skrip. |
| `X-XSS-Protection: 1; mode=block` | Mengaktifkan filter XSS bawaan browser. Header ini sebagian besar sudah usang di browser modern (Chrome menghapus XSS Auditor-nya pada 2019), tetapi masih memberikan pertahanan berlapis untuk pengguna di browser lama. |
| `Strict-Transport-Security` | Memaksa browser menggunakan HTTPS untuk semua permintaan masa depan ke domain selama durasi `max-age` yang ditentukan. Ini mencegah serangan downgrade protokol dan pembajakan cookie melalui koneksi HTTP yang tidak aman. Direktif `includeSubDomains` memperluas perlindungan ini ke semua subdomain. |
| `Referrer-Policy: strict-origin` | Mengontrol berapa banyak informasi referrer yang dikirim dengan permintaan keluar. Tanpa header ini, URL lengkap (termasuk parameter query yang mungkin berisi token atau data sensitif) dapat bocor ke situs pihak ketiga. `strict-origin` hanya mengirim origin (domain) dan hanya melalui HTTPS. |
| `Permissions-Policy` | Membatasi fitur browser mana (geolokasi, kamera, mikrofon, dll.) yang dapat digunakan oleh halaman. Ini membatasi kerusakan jika penyerang berhasil menyuntikkan skrip, karena skrip tersebut tidak dapat mengakses API perangkat sensitif. |

### Contoh

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  r := gin.Default()

  expectedHost := "localhost:8080"

  // Setup Security Headers
  r.Use(func(c *gin.Context) {
    if c.Request.Host != expectedHost {
      c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Invalid host header"})
      return
    }
    c.Header("X-Frame-Options", "DENY")
    c.Header("Content-Security-Policy", "default-src 'self'; connect-src *; font-src *; script-src-elem * 'unsafe-inline'; img-src * data:; style-src * 'unsafe-inline';")
    c.Header("X-XSS-Protection", "1; mode=block")
    c.Header("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
    c.Header("Referrer-Policy", "strict-origin")
    c.Header("X-Content-Type-Options", "nosniff")
    c.Header("Permissions-Policy", "geolocation=(),midi=(),sync-xhr=(),microphone=(),camera=(),magnetometer=(),gyroscope=(),fullscreen=(self),payment=()")
    c.Next()
  })

  r.GET("/ping", func(c *gin.Context) {
    c.JSON(200, gin.H{
      "message": "pong",
    })
  })

  r.Run() // listen and serve on 0.0.0.0:8080
}
```

Anda dapat mengujinya melalui `curl`:

```bash
// Check Headers

curl localhost:8080/ping -I

HTTP/1.1 404 Not Found
Content-Security-Policy: default-src 'self'; connect-src *; font-src *; script-src-elem * 'unsafe-inline'; img-src * data:; style-src * 'unsafe-inline';
Content-Type: text/plain
Permissions-Policy: geolocation=(),midi=(),sync-xhr=(),microphone=(),camera=(),magnetometer=(),gyroscope=(),fullscreen=(self),payment=()
Referrer-Policy: strict-origin
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-Xss-Protection: 1; mode=block
Date: Sat, 30 Mar 2024 08:20:44 GMT
Content-Length: 18

// Check Host Header Injection

curl localhost:8080/ping -I -H "Host:neti.ee"

HTTP/1.1 400 Bad Request
Content-Type: application/json; charset=utf-8
Date: Sat, 30 Mar 2024 08:21:09 GMT
Content-Length: 31
```

Opsional, gunakan [gin helmet](https://github.com/danielkov/gin-helmet) `go get github.com/danielkov/gin-helmet/ginhelmet`

```go
package main

import (
  "github.com/gin-gonic/gin"
  "github.com/danielkov/gin-helmet/ginhelmet"
)

func main() {
  r := gin.Default()

  // Use default security headers
  r.Use(ginhelmet.Default())

  r.GET("/", func(c *gin.Context) {
    c.JSON(200, gin.H{"message": "Hello, World!"})
  })

  r.Run()
}
```
