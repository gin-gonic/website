---
title: "HTTP metodu kullanımı"
sidebar:
  order: 1
---

Gin, doğrudan HTTP fiillerine eşlenen metodlar sağlar ve RESTful API'ler oluşturmayı kolaylaştırır. Her metod, yalnızca ilgili HTTP istek türüne yanıt veren bir rota kaydeder:

| Metod       | Tipik REST Kullanımı                  |
| ----------- | ------------------------------------- |
| **GET**     | Bir kaynağı alma                      |
| **POST**    | Yeni bir kaynak oluşturma             |
| **PUT**     | Mevcut bir kaynağı değiştirme         |
| **PATCH**   | Mevcut bir kaynağı kısmen güncelleme  |
| **DELETE**  | Bir kaynağı silme                     |
| **HEAD**    | GET ile aynı ama gövdesiz             |
| **OPTIONS** | İletişim seçeneklerini tanımlama      |

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

### curl ile test etme

Sunucu çalışırken, her uç noktayı test edebilirsiniz:

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

## Ayrıca bakınız

- [Yol parametreleri](/tr/docs/routing/param-in-path/)
- [Rota gruplama](/tr/docs/routing/grouping-routes/)
- [Sorgu dizesi parametreleri](/tr/docs/routing/querystring-param/)
