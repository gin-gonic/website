---
title: "Menggunakan metode HTTP"
sidebar:
  order: 1
---

Gin menyediakan metode yang memetakan langsung ke kata kerja HTTP, membuatnya mudah untuk membangun API RESTful. Setiap metode mendaftarkan rute yang hanya merespons tipe permintaan HTTP yang sesuai:

| Metode      | Penggunaan REST Umum                  |
| ----------- | ------------------------------------- |
| **GET**     | Mengambil sumber daya                 |
| **POST**    | Membuat sumber daya baru              |
| **PUT**     | Mengganti sumber daya yang ada        |
| **PATCH**   | Memperbarui sebagian sumber daya yang ada |
| **DELETE**  | Menghapus sumber daya                 |
| **HEAD**    | Sama seperti GET tetapi tanpa body    |
| **OPTIONS** | Menjelaskan opsi komunikasi           |

```go
package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func getting(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"method": "GET"})
}

func posting(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"method": "POST"})
}

func putting(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"method": "PUT"})
}

func deleting(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"method": "DELETE"})
}

func patching(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"method": "PATCH"})
}

func head(c *gin.Context) {
	c.Status(http.StatusOK)
}

func options(c *gin.Context) {
	c.Status(http.StatusOK)
}

func main() {
	// Membuat router Gin dengan middleware bawaan:
	// logger dan middleware recovery (bebas crash)
	router := gin.Default()

	router.GET("/someGet", getting)
	router.POST("/somePost", posting)
	router.PUT("/somePut", putting)
	router.DELETE("/someDelete", deleting)
	router.PATCH("/somePatch", patching)
	router.HEAD("/someHead", head)
	router.OPTIONS("/someOptions", options)

	// Secara bawaan berjalan di :8080 kecuali
	// variabel lingkungan PORT telah ditentukan.
	router.Run()
	// router.Run(":3000") menentukan port secara langsung di kode
}
```

### Pengujian dengan curl

Setelah server berjalan, Anda dapat menguji setiap endpoint:

```sh
# Permintaan GET
curl -X GET http://localhost:8080/someGet

# Permintaan POST
curl -X POST http://localhost:8080/somePost

# Permintaan PUT
curl -X PUT http://localhost:8080/somePut

# Permintaan DELETE
curl -X DELETE http://localhost:8080/someDelete

# Permintaan PATCH
curl -X PATCH http://localhost:8080/somePatch

# Permintaan HEAD (mengembalikan header saja, tanpa body)
curl -I http://localhost:8080/someHead

# Permintaan OPTIONS
curl -X OPTIONS http://localhost:8080/someOptions
```

## Lihat juga

- [Parameter di path](/id/docs/routing/param-in-path/)
- [Mengelompokkan rute](/id/docs/routing/grouping-routes/)
- [Parameter query string](/id/docs/routing/querystring-param/)
