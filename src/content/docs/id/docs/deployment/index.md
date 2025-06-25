---
title: "Deployment"
sidebar:
  order: 6
---

Proyek Gin dapat di-deploy dengan mudah di penyedia cloud apa pun.

## [Railway](https://www.railway.com)

Railway adalah platform pengembangan cloud canggih untuk men-deploy, mengelola, dan penskalaan aplikasi serta service. Platform ini menyederhanakan stack infrastruktur Anda, dari server hingga observabilitas dalam satu platform yang dapat diskalakan dan mudah digunakan.

Ikuti [panduan dari Railway untuk men-deploy proyek Gin Anda](https://docs.railway.com/guides/gin).

## [Koyeb](https://www.koyeb.com)

Koyeb adalah platform serverless yang ramah developer untuk men-deploy aplikasi secara global, dengan deployment berbasis Git, enkripsi TLS, autoscaling bawaan, jaringan edge global, serta service mesh & discovery terintegrasi.

Ikuti [panduan dari Koyeb untuk men-deploy proyek Gin Anda](https://www.koyeb.com/tutorials/deploy-go-gin-on-koyeb).

## [Qovery](https://www.qovery.com)

Qovery menyediakan hosting Cloud gratis dengan database, SSL, CDN global, dan deploy otomatis dengan Git.

Ikuti [panduan Qovery untuk men-deploy proyek Gin Anda](https://docs.qovery.com/guides/tutorial/deploy-gin-with-postgresql/).

## [Render](https://render.com)

Render adalah platform cloud modern yang menawarkan dukungan native untuk Go, SSL yang terkelola penuh, database, deploy zero-downtime, HTTP/2, dan dukungan websocket.

Ikuti [panduan dari Render untuk men-deploy proyek Gin Anda](https://render.com/docs/deploy-go-gin).

## [Google App Engine](https://cloud.google.com/appengine/)

GAE memiliki dua cara untuk men-deploy aplikasi Go. Lingkungan standar lebih mudah digunakan, tetapi kustomisasinya lebih terbatas dan mencegah [syscalls](https://github.com/gin-gonic/gin/issues/1639) untuk alasan keamanan. Lingkungan fleksibel dapat menjalankan framework atau library apa pun.

Pelajari lebih lanjut dan pilih lingkungan sesuai preferensi Anda di [Go on Google App Engine](https://cloud.google.com/appengine/docs/go/).

## Self Hosted

Proyek Gin juga dapat di-deploy secara mandiri. Arsitektur deployment dan aspek keamanan bervariasi, tergantung pada lingkungan target. Bagian berikut hanya menyajikan gambaran umum tentang opsi konfigurasi yang perlu dipertimbangkan saat merencanakan deployment.

## Opsi Konfigurasi

Deployment proyek Gin dapat disesuaikan menggunakan variabel lingkungan atau langsung di dalam kode.

Berikut variabel lingkungan yang tersedia untuk mengonfigurasi Gin:

| Variabel Lingkungan | Deskripsi                                                                                                                                                                                                   |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PORT                 | Port TCP yang akan digunakan saat memulai server Gin dengan `router.Run()` (tanpa argumen apa pun).                                                                                                      |
| GIN_MODE             | Atur ke salah satu dari `debug`, `release`, atau `test`. Mengelola mode Gin, seperti kapan harus menampilkan output debug. Dapat juga diatur dalam kode menggunakan `gin.SetMode(gin.ReleaseMode)` atau `gin.SetMode(gin.TestMode)` |

Kode berikut dapat digunakan untuk mengonfigurasi Gin.

```go
// Tanpa menentukan alamat bind atau port untuk Gin. Secara bawaan akan mengikat pada semua interface di port 8080.
// Anda juga dapat menggunakan variabel lingkungan PORT untuk mengubah listen port saat menggunakan Run() tanpa argumen apa pun.
router := gin.Default()
router.Run()

// Secara eksplisit menentukan alamat bind dan port binding
router := gin.Default()
router.Run("192.168.1.100:8080")

// Hanya secara eksplisit menentukan listen port. Akan mengikat pada semua interface.
router := gin.Default()
router.Run(":8080")

// Tentukan alamat IP atau CIDR mana yang dianggap tepercaya untuk mengatur header untuk mendokumentasikan alamat IP asli klien.
// Lihat dokumentasi untuk detail lebih lanjut.
router := gin.Default()
router.SetTrustedProxies([]string{"192.168.1.2"})
```

## Jangan percayai semua proksi

Gin memungkinkan Anda menentukan header mana saja yang akan menyimpan IP asli klien (jika ada),
serta menentukan proksi (atau klien langsung) mana yang Anda percayai untuk
menentukan salah satu dari header tersebut.

Gunakan fungsi `SetTrustedProxies()` pada `gin.Engine` Anda untuk menentukan alamat jaringan
atau CIDR mana saja yang dapat dipercaya untuk header permintaan terkait IP klien.
Nilainya dapat berupa alamat IPv4, CIDR IPv4, alamat IPv6, atau +CIDR IPv6.

**Perhatian:** Secara bawaan Gin memercayai semua proksi jika Anda tidak menentukan proxy tepercaya secara eksplisit
menggunakan fungsi di atas, **hal ini TIDAK aman**. Di sisi lain, jika Anda tidak
menggunakan proxy apa pun, Anda dapat menonaktifkan fitur ini dengan menggunakan `Engine.SetTrustedProxies(nil)`,
sehingga `Context.ClientIP()` akan langsung mengembalikan alamat remote untuk menghindari
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
    // Jika klien adalah 192.168.1.2, gunakan header X-Forwarded-For
    // untuk menentukan IP asli klien dari bagian-bagian header
    // yang terpercaya.
    // Jika tidak, kembalikan langsung IP klien.
    fmt.Printf("ClientIP: %s\n", c.ClientIP())
  })
  router.Run()
}
```

**Perhatian:** Jika Anda menggunakan layanan CDN, Anda dapat mengatur `Engine.TrustedPlatform`
untuk melewati pemeriksaan TrustedProxies, karena memiliki prioritas lebih tinggi daripada TrustedProxies.
Lihat contoh di bawah ini:

```go
import (
  "fmt"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()
  // Gunakan header yang telah ditentukan sebelumnya gin.PlatformXXX
  // Google App Engine
  router.TrustedPlatform = gin.PlatformGoogleAppEngine
  // Cloudflare
  router.TrustedPlatform = gin.PlatformCloudflare
  // Fly.io
  router.TrustedPlatform = gin.PlatformFlyIO
  // Atau, Anda dapat mengatur header permintaan tepercaya Anda sendiri. Namun, pastikan CDN Anda
  // mencegah pengguna mengirimkan header ini! Misalnya, jika CDN Anda menempatkan
  // IP klien di X-CDN-Client-IP:
  router.TrustedPlatform = "X-CDN-Client-IP"

  router.GET("/", func(c *gin.Context) {
    // Jika Anda mengatur TrustedPlatform, ClientIP() akan menyelesaikan
    // header yang sesuai dan mengembalikan IP secara langsung.
    fmt.Printf("ClientIP: %s\n", c.ClientIP())
  })
  router.Run()
}
```
