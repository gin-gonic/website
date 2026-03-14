---
title: "Menyajikan data dari file"
sidebar:
  order: 7
---

Gin menyediakan beberapa metode untuk menyajikan file ke klien. Setiap metode cocok untuk kasus penggunaan yang berbeda:

- **`c.File(path)`** -- Menyajikan file dari filesystem lokal. Tipe konten terdeteksi secara otomatis. Gunakan ini ketika Anda tahu path file yang tepat saat kompilasi atau sudah memvalidasinya.
- **`c.FileFromFS(path, fs)`** -- Menyajikan file dari antarmuka `http.FileSystem`. Berguna saat menyajikan file dari filesystem yang disematkan (`embed.FS`), backend penyimpanan kustom, atau ketika Anda ingin membatasi akses ke pohon direktori tertentu.
- **`c.FileAttachment(path, filename)`** -- Menyajikan file sebagai unduhan dengan mengatur header `Content-Disposition: attachment`. Browser akan meminta pengguna untuk menyimpan file menggunakan nama file yang Anda berikan, terlepas dari nama file asli di disk.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  // Serve a file inline (displayed in browser)
  router.GET("/local/file", func(c *gin.Context) {
    c.File("local/file.go")
  })

  // Serve a file from an http.FileSystem
  var fs http.FileSystem = http.Dir("/var/www/assets")
  router.GET("/fs/file", func(c *gin.Context) {
    c.FileFromFS("fs/file.go", fs)
  })

  // Serve a file as a downloadable attachment with a custom filename
  router.GET("/download", func(c *gin.Context) {
    c.FileAttachment("local/report-2024-q1.xlsx", "quarterly-report.xlsx")
  })

  router.Run(":8080")
}
```

Anda dapat menguji endpoint unduhan dengan curl:

```sh
# The -v flag shows the Content-Disposition header
curl -v http://localhost:8080/download --output report.xlsx

# Serve a file inline
curl http://localhost:8080/local/file
```

Untuk streaming data dari `io.Reader` (seperti URL remote atau konten yang dihasilkan secara dinamis), gunakan `c.DataFromReader()` sebagai gantinya. Lihat [Menyajikan data dari reader](/id/docs/rendering/serving-data-from-reader/) untuk detail.

:::caution[Keamanan: path traversal]
Jangan pernah meneruskan input pengguna langsung ke `c.File()` atau `c.FileAttachment()`. Penyerang dapat memberikan path seperti `../../etc/passwd` untuk membaca file sembarang di server Anda. Selalu validasi dan sanitasi path file, atau gunakan `c.FileFromFS()` dengan `http.FileSystem` yang dibatasi yang membatasi akses ke direktori tertentu.

```go
// DANGEROUS -- never do this
router.GET("/files/:name", func(c *gin.Context) {
  c.File(c.Param("name")) // attacker controls the path
})

// SAFE -- restrict to a specific directory
var safeFS http.FileSystem = http.Dir("/var/www/public")
router.GET("/files/:name", func(c *gin.Context) {
  c.FileFromFS(c.Param("name"), safeFS)
})
```
:::
