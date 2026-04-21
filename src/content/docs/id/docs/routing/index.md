---
title: "Routing"
sidebar:
  order: 3
---

Gin menyediakan sistem routing powerful yang dibangun di atas [httprouter](https://github.com/julienschmidt/httprouter) untuk pencocokan URL berperforma tinggi. Di balik layar, httprouter menggunakan [radix tree](https://en.wikipedia.org/wiki/Radix_tree) (juga disebut compressed trie) untuk menyimpan dan mencari rute, yang berarti pencocokan rute sangat cepat dan tidak memerlukan alokasi memori per pencarian. Ini menjadikan Gin salah satu framework web Go tercepat yang tersedia.

Rute didaftarkan dengan memanggil metode HTTP pada engine (atau grup rute) dan menyediakan pola URL beserta satu atau lebih fungsi handler:

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.GET("/hello", func(c *gin.Context) {
    c.String(http.StatusOK, "Hello, World!")
  })

  router.POST("/users", func(c *gin.Context) {
    name := c.PostForm("name")
    c.JSON(http.StatusCreated, gin.H{"user": name})
  })

  router.Run(":8080")
}
```

## Dalam bagian ini

Halaman-halaman di bawah ini membahas setiap topik routing secara detail:

- [**Menggunakan metode HTTP**](./http-method/) -- Mendaftarkan rute untuk GET, POST, PUT, DELETE, PATCH, HEAD, dan OPTIONS.
- [**Parameter di path**](./param-in-path/) -- Menangkap segmen dinamis dari path URL (misal `/user/:name`).
- [**Parameter querystring**](./querystring-param/) -- Membaca nilai query string dari URL permintaan.
- [**Query dan post form**](./query-and-post-form/) -- Mengakses data query string dan POST form dalam handler yang sama.
- [**Map sebagai querystring atau postform**](./map-as-querystring-or-postform/) -- Mengikat parameter map dari query string atau POST form.
- [**Form multipart/urlencoded**](./multipart-urlencoded-form/) -- Melakukan parse body `multipart/form-data` dan `application/x-www-form-urlencoded`.
- [**Unggah file**](./upload-file/) -- Menangani unggahan file tunggal dan banyak.
- [**Mengelompokkan rute**](./grouping-routes/) -- Mengorganisasi rute di bawah prefix umum dengan middleware bersama.
- [**Redirect**](./redirects/) -- Melakukan redirect HTTP dan tingkat router.
