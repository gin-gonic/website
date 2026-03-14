---
title: "Proxy tepercaya"
sidebar:
  order: 8
---

Gin memungkinkan Anda menentukan header mana yang menyimpan IP klien asli (jika ada),
serta menentukan proxy (atau klien langsung) mana yang Anda percaya untuk
menentukan salah satu header ini.

### Mengapa konfigurasi proxy tepercaya penting

Ketika aplikasi Anda berada di balik reverse proxy (Nginx, HAProxy, cloud load balancer, dll.), proxy meneruskan alamat IP klien asli dalam header seperti `X-Forwarded-For` atau `X-Real-Ip`. Masalahnya adalah **klien mana pun dapat mengatur header ini**. Tanpa konfigurasi proxy tepercaya yang tepat, penyerang dapat memalsukan `X-Forwarded-For` untuk:

- **Melewati kontrol akses berbasis IP** -- Jika aplikasi Anda membatasi rute tertentu ke rentang IP internal (mis., `10.0.0.0/8`), penyerang dapat mengirim `X-Forwarded-For: 10.0.0.1` dari IP publik dan melewati pembatasan sepenuhnya.
- **Meracuni log dan jejak audit** -- IP palsu membuat investigasi insiden tidak dapat diandalkan karena Anda tidak lagi dapat melacak permintaan kembali ke sumber asli.
- **Menghindari rate limiting** -- Jika rate limiting dikunci pada `ClientIP()`, setiap permintaan dapat mengklaim alamat IP berbeda untuk menghindari throttling.

`SetTrustedProxies` menyelesaikan ini dengan memberitahu Gin alamat jaringan mana yang merupakan proxy yang sah. Ketika `ClientIP()` mem-parse rantai `X-Forwarded-For`, ia hanya mempercayai entri yang ditambahkan oleh proxy tersebut dan mengabaikan apa pun yang mungkin telah ditambahkan klien di depan. Jika permintaan datang secara langsung (bukan dari proxy tepercaya), header forwarding diabaikan sepenuhnya dan alamat remote mentah digunakan.

Gunakan fungsi `SetTrustedProxies()` pada `gin.Engine` Anda untuk menentukan alamat jaringan
atau CIDR jaringan dari mana klien yang header permintaannya terkait dengan IP klien
dapat dipercaya. Dapat berupa alamat IPv4, CIDR IPv4, alamat IPv6, atau
CIDR IPv6.

**Perhatian:** Gin mempercayai semua proxy secara default jika Anda tidak menentukan proxy
tepercaya menggunakan fungsi di atas, **ini TIDAK aman**. Pada saat yang sama, jika Anda tidak
menggunakan proxy apa pun, Anda dapat menonaktifkan fitur ini menggunakan `Engine.SetTrustedProxies(nil)`,
maka `Context.ClientIP()` akan mengembalikan alamat remote secara langsung untuk menghindari
komputasi yang tidak perlu.

```go
import (
  "fmt"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()
  router.SetTrustedProxies([]string{"192.168.1.2"})

  router.GET("/", func(c *gin.Context) {
    // If the client is 192.168.1.2, use the X-Forwarded-For
    // header to deduce the original client IP from the trust-
    // worthy parts of that header.
    // Otherwise, simply return the direct client IP
    fmt.Printf("ClientIP: %s\n", c.ClientIP())
  })
  router.Run()
}
```

**Perhatikan:** Jika Anda menggunakan layanan CDN, Anda dapat mengatur `Engine.TrustedPlatform`
untuk melewati pemeriksaan TrustedProxies, yang memiliki prioritas lebih tinggi dari TrustedProxies.
Lihat contoh di bawah:

```go
import (
  "fmt"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()
  // Use predefined header gin.PlatformXXX
  // Google App Engine
  router.TrustedPlatform = gin.PlatformGoogleAppEngine
  // Cloudflare
  router.TrustedPlatform = gin.PlatformCloudflare
  // Fly.io
  router.TrustedPlatform = gin.PlatformFlyIO
  // Or, you can set your own trusted request header. But be sure your CDN
  // prevents users from passing this header! For example, if your CDN puts
  // the client IP in X-CDN-Client-IP:
  router.TrustedPlatform = "X-CDN-Client-IP"

  router.GET("/", func(c *gin.Context) {
    // If you set TrustedPlatform, ClientIP() will resolve the
    // corresponding header and return IP directly
    fmt.Printf("ClientIP: %s\n", c.ClientIP())
  })
  router.Run()
}
```
