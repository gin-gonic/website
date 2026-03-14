---
title: "Menyajikan file statis"
sidebar:
  order: 6
---

Gin menyediakan tiga metode untuk menyajikan konten statis:

- **`router.Static(relativePath, root)`** -- Menyajikan seluruh direktori. Permintaan ke `relativePath` dipetakan ke file di bawah `root`. Misalnya, `router.Static("/assets", "./assets")` menyajikan `./assets/style.css` di `/assets/style.css`.
- **`router.StaticFS(relativePath, fs)`** -- Seperti `Static`, tetapi menerima antarmuka `http.FileSystem`, memberi Anda kontrol lebih atas bagaimana file diselesaikan. Gunakan ini ketika Anda perlu menyajikan file dari filesystem yang disematkan atau ingin menyesuaikan perilaku daftar direktori.
- **`router.StaticFile(relativePath, filePath)`** -- Menyajikan satu file. Berguna untuk endpoint seperti `/favicon.ico` atau `/robots.txt`.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()
  router.Static("/assets", "./assets")
  router.StaticFS("/more_static", http.Dir("my_file_system"))
  router.StaticFile("/favicon.ico", "./resources/favicon.ico")

  // Listen and serve on 0.0.0.0:8080
  router.Run(":8080")
}
```

:::caution[Keamanan: path traversal]
Direktori yang Anda teruskan ke `Static()` atau `http.Dir()` akan sepenuhnya dapat diakses oleh klien mana pun. Pastikan tidak berisi file sensitif seperti file konfigurasi, file `.env`, kunci privat, atau file database.

Sebagai praktik terbaik:

- Gunakan direktori khusus yang hanya berisi file yang ingin Anda sajikan secara publik.
- Hindari meneruskan path seperti `"."` atau `"/"` yang dapat mengekspos seluruh proyek atau filesystem Anda.
- Jika Anda memerlukan kontrol lebih halus (misalnya, menonaktifkan daftar direktori), gunakan `StaticFS` dengan implementasi `http.FileSystem` kustom. `http.Dir` standar mengaktifkan daftar direktori secara default.
:::
