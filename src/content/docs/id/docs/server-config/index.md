---
title: "Konfigurasi Server"
sidebar:
  order: 8
---

Gin menawarkan opsi konfigurasi server yang fleksibel. Karena `gin.Engine` mengimplementasikan antarmuka `http.Handler`, Anda dapat menggunakannya dengan `net/http.Server` standar Go untuk mengontrol timeout, TLS, dan pengaturan lainnya secara langsung.

## Menggunakan http.Server kustom

Secara default, `router.Run()` memulai server HTTP dasar. Untuk penggunaan produksi, buat `http.Server` Anda sendiri untuk mengatur timeout dan opsi lainnya:

```go
func main() {
  router := gin.Default()
  router.GET("/", func(c *gin.Context) {
    c.String(200, "ok")
  })

  s := &http.Server{
    Addr:           ":8080",
    Handler:        router,
    ReadTimeout:    10 * time.Second,
    WriteTimeout:   10 * time.Second,
    MaxHeaderBytes: 1 << 20,
  }
  s.ListenAndServe()
}
```

Ini memberi Anda akses penuh ke konfigurasi server Go sambil mempertahankan semua kemampuan routing dan middleware Gin.

## Dalam bagian ini

- [**Konfigurasi HTTP kustom**](./custom-http-config/) -- Menyesuaikan server HTTP yang mendasari
- [**Codec JSON kustom**](./custom-json-codec/) -- Menggunakan pustaka serialisasi JSON alternatif
- [**Let's Encrypt**](./lets-encrypt/) -- Sertifikat TLS otomatis dengan Let's Encrypt
- [**Menjalankan beberapa layanan**](./multiple-service/) -- Melayani beberapa engine Gin pada port berbeda
- [**Restart atau stop graceful**](./graceful-restart-or-stop/) -- Mematikan tanpa memutus koneksi aktif
- [**HTTP/2 server push**](./http2-server-push/) -- Push sumber daya ke klien secara proaktif
- [**Penanganan cookie**](./cookie/) -- Membaca dan menulis cookie HTTP
- [**Proxy tepercaya**](./trusted-proxies/) -- Mengonfigurasi proxy mana yang dipercaya Gin untuk resolusi IP klien
