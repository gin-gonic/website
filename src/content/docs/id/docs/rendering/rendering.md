---
title: "Rendering XML/JSON/YAML/ProtoBuf"
sidebar:
  order: 1
---

Gin menyediakan dukungan bawaan untuk rendering respons dalam berbagai format termasuk JSON, XML, YAML, dan Protocol Buffers. Ini memudahkan pembangunan API yang mendukung negosiasi konten -- menyajikan data dalam format apa pun yang diminta klien.

**Kapan menggunakan setiap format:**

- **JSON** -- Pilihan paling umum untuk REST API dan klien berbasis browser. Gunakan `c.JSON()` untuk output standar atau `c.IndentedJSON()` untuk format yang mudah dibaca saat pengembangan.
- **XML** -- Berguna saat mengintegrasikan dengan sistem lama, layanan SOAP, atau klien yang mengharapkan XML (seperti beberapa aplikasi enterprise).
- **YAML** -- Cocok untuk endpoint berorientasi konfigurasi atau alat yang mengonsumsi YAML secara native (seperti Kubernetes atau pipeline CI/CD).
- **ProtoBuf** -- Ideal untuk komunikasi berperforma tinggi dan latensi rendah antar layanan. Protocol Buffers menghasilkan payload lebih kecil dan serialisasi lebih cepat dibandingkan format berbasis teks, tetapi memerlukan definisi skema bersama (file `.proto`).

Semua metode rendering menerima kode status HTTP dan nilai data. Gin menyerialisasi data dan mengatur header `Content-Type` yang sesuai secara otomatis.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
  "github.com/gin-gonic/gin/testdata/protoexample"
)

func main() {
  router := gin.Default()

  // gin.H is a shortcut for map[string]interface{}
  router.GET("/someJSON", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{"message": "hey", "status": http.StatusOK})
  })

  router.GET("/moreJSON", func(c *gin.Context) {
    // You also can use a struct
    var msg struct {
      Name    string `json:"user"`
      Message string
      Number  int
    }
    msg.Name = "Lena"
    msg.Message = "hey"
    msg.Number = 123
    // Note that msg.Name becomes "user" in the JSON
    // Will output  :   {"user": "Lena", "Message": "hey", "Number": 123}
    c.JSON(http.StatusOK, msg)
  })

  router.GET("/someXML", func(c *gin.Context) {
    c.XML(http.StatusOK, gin.H{"message": "hey", "status": http.StatusOK})
  })

  router.GET("/someYAML", func(c *gin.Context) {
    c.YAML(http.StatusOK, gin.H{"message": "hey", "status": http.StatusOK})
  })

  router.GET("/someProtoBuf", func(c *gin.Context) {
    reps := []int64{int64(1), int64(2)}
    label := "test"
    // The specific definition of protobuf is written in the testdata/protoexample file.
    data := &protoexample.Test{
      Label: &label,
      Reps:  reps,
    }
    // Note that data becomes binary data in the response
    // Will output protoexample.Test protobuf serialized data
    c.ProtoBuf(http.StatusOK, data)
  })

  // Listen and serve on 0.0.0.0:8080
  router.Run(":8080")
}
```

## Lihat juga

- [PureJSON](/id/docs/rendering/pure-json/)
- [SecureJSON](/id/docs/rendering/secure-json/)
- [AsciiJSON](/id/docs/rendering/ascii-json/)
- [JSONP](/id/docs/rendering/jsonp/)
