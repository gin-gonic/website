---
title: "Penanganan Cookie"
sidebar:
  order: 7
---

Gin menyediakan helper untuk mengatur dan membaca cookie HTTP pada respons dan permintaan.

### Parameter `SetCookie`

Signature metode `c.SetCookie()` adalah:

```go
c.SetCookie(name, value string, maxAge int, path, domain string, secure, httpOnly bool)
```

| Parameter  | Deskripsi |
|------------|-----------|
| `name`     | Nama cookie (kunci). |
| `value`    | Nilai cookie. |
| `maxAge`   | Masa hidup dalam **detik**. Atur ke `-1` untuk menghapus cookie, atau `0` untuk menjadikannya cookie session (dihapus saat browser ditutup). |
| `path`     | Path URL di mana cookie valid. Gunakan `"/"` untuk membuatnya tersedia di seluruh situs. |
| `domain`   | Domain yang dicakup cookie (mis., `"example.com"`). Gunakan `"localhost"` selama pengembangan. |
| `secure`   | Ketika `true`, cookie hanya dikirim melalui koneksi **HTTPS**. **Atur ini ke `true` di produksi.** |
| `httpOnly` | Ketika `true`, cookie tidak dapat diakses oleh JavaScript sisi klien (`document.cookie`), yang membantu mencegah serangan XSS. **Atur ini ke `true` di produksi.** |

:::tip[Rekomendasi produksi]
Untuk deployment produksi, atur `Secure: true`, `HttpOnly: true`, dan `SameSite: Strict` (atau `Lax`) untuk meminimalkan paparan terhadap serangan cross-site request forgery (CSRF) dan cross-site scripting (XSS).
:::

### Mengatur dan mendapatkan cookie

```go
import (
  "fmt"

  "github.com/gin-gonic/gin"
)

func main() {

  router := gin.Default()

  router.GET("/cookie", func(c *gin.Context) {

    cookie, err := c.Cookie("gin_cookie")

    if err != nil {
      cookie = "NotSet"
      c.SetCookie("gin_cookie", "test", 3600, "/", "localhost", false, true)
    }

    fmt.Printf("Cookie value: %s \n", cookie)
  })

  router.Run()
}
```

### Coba jalankan

```bash
# First request -- no cookie sent, server sets one
curl -v http://localhost:8080/cookie
# Look for "Set-Cookie: gin_cookie=test" in the response headers

# Second request -- send the cookie back
curl -v --cookie "gin_cookie=test" http://localhost:8080/cookie
# Server logs: Cookie value: test
```

### Menghapus cookie

Hapus cookie dengan mengatur max age ke `-1`.

```go
c.SetCookie("gin_cookie", "test", -1, "/", "localhost", false, true)
```

### Mengatur cookie melalui http.Cookie (v1.11+)

Gin juga mendukung pengaturan cookie menggunakan `*http.Cookie`, memberikan akses ke field seperti `Expires`, `MaxAge`, `SameSite`, dan `Partitioned`.

```go
import (
  "net/http"
  "time"
  "github.com/gin-gonic/gin"
)

func main() {
  r := gin.Default()
  r.GET("/set-cookie", func(c *gin.Context) {
    c.SetCookieData(&http.Cookie{
      Name:   "session_id",
      Value:  "abc123",
      Path:   "/",
      Domain:   "localhost",
      Expires:  time.Now().Add(24 * time.Hour),
      MaxAge:   86400,
      Secure:   true,
      HttpOnly: true,
      SameSite: http.SameSiteLaxMode,
      // Partitioned: true, // Go 1.22+
    })
    c.String(http.StatusOK, "ok")
  })
  r.Run(":8080")
}
```

## Lihat juga

- [Header keamanan](/id/docs/middleware/security-headers/)
