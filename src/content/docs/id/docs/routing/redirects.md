---
title: "Redirect"
sidebar:
  order: 9
---

Gin mendukung redirect HTTP (mengirim klien ke URL berbeda) dan redirect router (meneruskan permintaan secara internal ke handler lain tanpa round-trip ke klien).

## Redirect HTTP

Gunakan `c.Redirect` dengan kode status HTTP yang sesuai untuk mengarahkan klien:

- **301 (`http.StatusMovedPermanently`)** — sumber daya telah pindah secara permanen. Peramban dan mesin pencari memperbarui cache mereka.
- **302 (`http.StatusFound`)** — redirect sementara. Peramban mengikuti tetapi tidak menyimpan URL baru di cache.
- **307 (`http.StatusTemporaryRedirect`)** — seperti 302, tetapi peramban harus mempertahankan metode HTTP asli (berguna untuk redirect POST).
- **308 (`http.StatusPermanentRedirect`)** — seperti 301, tetapi peramban harus mempertahankan metode HTTP asli.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  // Redirect eksternal (GET)
  router.GET("/old", func(c *gin.Context) {
    c.Redirect(http.StatusMovedPermanently, "https://www.google.com/")
  })

  // Redirect dari POST -- gunakan 302 atau 307 untuk mempertahankan perilaku
  router.POST("/submit", func(c *gin.Context) {
    c.Redirect(http.StatusFound, "/result")
  })

  // Redirect internal router (tidak ada round-trip HTTP)
  router.GET("/test", func(c *gin.Context) {
    c.Request.URL.Path = "/final"
    router.HandleContext(c)
  })

  router.GET("/final", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{"hello": "world"})
  })

  router.GET("/result", func(c *gin.Context) {
    c.String(http.StatusOK, "Redirected here!")
  })

  router.Run(":8080")
}
```

## Uji coba

```sh
# GET redirect -- diarahkan ke Google (gunakan -L untuk mengikuti pengalihan, -I untuk melihat header saja)
curl -I http://localhost:8080/old
# Output includes: HTTP/1.1 301 Moved Permanently
# Output includes: Location: https://www.google.com/

# POST redirect -- mengembalikan 302 dengan lokasi baru
curl -X POST -I http://localhost:8080/submit
# Output includes: HTTP/1.1 302 Found
# Output includes: Location: /result

# Redirect internal -- ditangani di sisi server, klien melihat respons akhir
curl http://localhost:8080/test
# Output: {"hello":"world"}
```

:::caution
Saat melakukan redirect dari handler POST, gunakan `302` atau `307` sebagai pengganti `301`. Redirect `301` dapat menyebabkan beberapa browser mengubah metode dari POST ke GET, yang dapat menyebabkan perilaku yang tidak diharapkan.
:::

:::tip
Redirect internal melalui `router.HandleContext(c)` tidak mengirim respons redirect ke klien. Permintaan dilakukan route ulang di dalam server, yang lebih cepat dan tidak terlihat oleh klien.
:::

## Lihat juga

- [Mengelompokkan rute](/id/docs/routing/grouping-routes/)
