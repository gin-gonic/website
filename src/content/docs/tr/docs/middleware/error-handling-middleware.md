---
title: "Hata işleme ara katmanı"
sidebar:
  order: 4
---

Tipik bir RESTful uygulamada, herhangi bir rotada hatalarla karşılaşabilirsiniz — geçersiz girdi, veritabanı hataları, yetkisiz erişim veya dahili hatalar. Her handler'da hataları tek tek ele almak tekrarlayan koda ve tutarsız yanıtlara yol açar.

Merkezi bir hata işleme ara katmanı, her istekten sonra çalışarak ve `c.Error(err)` ile Gin context'ine eklenen hataları kontrol ederek bu sorunu çözer. Hata bulunursa, uygun durum koduyla yapılandırılmış bir JSON yanıtı gönderir.

```go
package main

import (
  "errors"
  "net/http"

  "github.com/gin-gonic/gin"
)

// ErrorHandler captures errors and returns a consistent JSON error response
func ErrorHandler() gin.HandlerFunc {
  return func(c *gin.Context) {
    c.Next() // Process the request first

    // Check if any errors were added to the context
    if len(c.Errors) > 0 {
      err := c.Errors.Last().Err

      c.JSON(http.StatusInternalServerError, gin.H{
        "success": false,
        "message": err.Error(),
      })
    }
  }
}

func main() {
  r := gin.Default()

  // Attach the error-handling middleware
  r.Use(ErrorHandler())

  r.GET("/ok", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{
      "success": true,
      "message": "Everything is fine!",
    })
  })

  r.GET("/error", func(c *gin.Context) {
    c.Error(errors.New("something went wrong"))
  })

  r.Run(":8080")
}
```

## Test et

```sh
# Successful request
curl http://localhost:8080/ok
# Output: {"message":"Everything is fine!","success":true}

# Error request -- middleware catches the error
curl http://localhost:8080/error
# Output: {"message":"something went wrong","success":false}
```

:::tip
Bu deseni, belirli hata türlerini farklı HTTP durum kodlarıyla eşleştirmek veya yanıt vermeden önce hataları harici bir servise loglamak için genişletebilirsiniz.
:::

## Ayrıca bakınız

- [Özel ara katman](/tr/docs/middleware/custom-middleware/)
- [Ara katman kullanma](/tr/docs/middleware/using-middleware/)
