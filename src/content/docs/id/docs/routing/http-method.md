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
	// Creates a gin router with default middleware:
	// logger and recovery (crash-free) middleware
	router := gin.Default()

	router.GET("/someGet", getting)
	router.POST("/somePost", posting)
	router.PUT("/somePut", putting)
	router.DELETE("/someDelete", deleting)
	router.PATCH("/somePatch", patching)
	router.HEAD("/someHead", head)
	router.OPTIONS("/someOptions", options)

	// By default it serves on :8080 unless a
	// PORT environment variable was defined.
	router.Run()
	// router.Run(":3000") for a hard coded port
}
```

### Pengujian dengan curl

Setelah server berjalan, Anda dapat menguji setiap endpoint:

```sh
# GET request
curl -X GET http://localhost:8080/someGet

# POST request
curl -X POST http://localhost:8080/somePost

# PUT request
curl -X PUT http://localhost:8080/somePut

# DELETE request
curl -X DELETE http://localhost:8080/someDelete

# PATCH request
curl -X PATCH http://localhost:8080/somePatch

# HEAD request (returns headers only, no body)
curl -I http://localhost:8080/someHead

# OPTIONS request
curl -X OPTIONS http://localhost:8080/someOptions
```

## Lihat juga

- [Parameter di path](/id/docs/routing/param-in-path/)
- [Mengelompokkan rute](/id/docs/routing/grouping-routes/)
- [Parameter query string](/id/docs/routing/querystring-param/)
