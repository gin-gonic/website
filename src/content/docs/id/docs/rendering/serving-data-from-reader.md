---
title: "Menyajikan data dari reader"
sidebar:
  order: 8
---

`DataFromReader` memungkinkan Anda melakukan streaming data dari `io.Reader` apa pun langsung ke respons HTTP tanpa mem-buffer seluruh konten di memori terlebih dahulu. Ini penting untuk membangun endpoint proxy atau menyajikan file besar dari sumber remote secara efisien.

**Kasus penggunaan umum:**

- **Mem-proxy sumber daya remote** -- Mengambil file dari layanan eksternal (seperti API penyimpanan cloud atau CDN) dan meneruskannya ke klien. Data mengalir melalui server Anda tanpa dimuat sepenuhnya ke memori.
- **Menyajikan konten yang dihasilkan** -- Streaming data yang dihasilkan secara dinamis (seperti ekspor CSV atau file laporan) saat diproduksi.
- **Unduhan file besar** -- Menyajikan file yang terlalu besar untuk disimpan di memori, dengan membacanya dalam potongan dari disk atau dari sumber remote.

Signature metodenya adalah `c.DataFromReader(code, contentLength, contentType, reader, extraHeaders)`. Anda menyediakan kode status HTTP, panjang konten (agar klien tahu ukuran total), tipe MIME, `io.Reader` untuk streaming, dan map opsional header respons tambahan (seperti `Content-Disposition` untuk unduhan file).

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()
  router.GET("/someDataFromReader", func(c *gin.Context) {
    response, err := http.Get("https://raw.githubusercontent.com/gin-gonic/logo/master/color.png")
    if err != nil || response.StatusCode != http.StatusOK {
      c.Status(http.StatusServiceUnavailable)
      return
    }

    reader := response.Body
    contentLength := response.ContentLength
    contentType := response.Header.Get("Content-Type")

    extraHeaders := map[string]string{
      "Content-Disposition": `attachment; filename="gopher.png"`,
    }

    c.DataFromReader(http.StatusOK, contentLength, contentType, reader, extraHeaders)
  })
  router.Run(":8080")
}
```

Dalam contoh ini, Gin mengambil gambar dari GitHub dan melakukan streaming langsung ke klien sebagai lampiran yang dapat diunduh. Byte gambar mengalir dari body respons HTTP upstream melalui ke respons klien tanpa dikumpulkan dalam buffer. Perhatikan bahwa `response.Body` secara otomatis ditutup oleh server HTTP setelah handler selesai, karena `DataFromReader` membacanya sampai habis selama penulisan respons.
