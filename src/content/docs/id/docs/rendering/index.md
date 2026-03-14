---
title: "Rendering"
sidebar:
  order: 5
---

Gin mendukung rendering respons dalam berbagai format termasuk JSON, XML, YAML, ProtoBuf, HTML, dan lainnya. Setiap metode rendering mengikuti pola yang sama: panggil metode pada `*gin.Context` dengan kode status HTTP dan data yang akan diserialisasi. Gin menangani header content-type, serialisasi, dan penulisan respons secara otomatis.

```go
// All rendering methods share this pattern:
c.JSON(http.StatusOK, data)   // application/json
c.XML(http.StatusOK, data)    // application/xml
c.YAML(http.StatusOK, data)   // application/x-yaml
c.TOML(http.StatusOK, data)   // application/toml
c.ProtoBuf(http.StatusOK, data) // application/x-protobuf
```

Anda dapat menggunakan header `Accept` atau parameter query untuk menyajikan data yang sama dalam berbagai format dari satu handler:

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.GET("/user", func(c *gin.Context) {
    user := gin.H{"name": "Lena", "role": "admin"}

    switch c.Query("format") {
    case "xml":
      c.XML(http.StatusOK, user)
    case "yaml":
      c.YAML(http.StatusOK, user)
    default:
      c.JSON(http.StatusOK, user)
    }
  })

  router.Run(":8080")
}
```

## Dalam bagian ini

- [**Rendering XML/JSON/YAML/ProtoBuf**](./rendering/) -- Render respons dalam berbagai format dengan penanganan content-type otomatis
- [**SecureJSON**](./secure-json/) -- Mencegah serangan JSON hijacking di browser lama
- [**JSONP**](./jsonp/) -- Mendukung permintaan cross-domain dari klien lama tanpa CORS
- [**AsciiJSON**](./ascii-json/) -- Meng-escape karakter non-ASCII untuk transportasi yang aman
- [**PureJSON**](./pure-json/) -- Render JSON tanpa meng-escape karakter HTML
- [**Menyajikan file statis**](./serving-static-files/) -- Menyajikan direktori aset statis
- [**Menyajikan data dari file**](./serving-data-from-file/) -- Menyajikan file individual, lampiran, dan unduhan
- [**Menyajikan data dari reader**](./serving-data-from-reader/) -- Streaming data dari `io.Reader` apa pun ke respons
- [**Rendering HTML**](./html-rendering/) -- Render template HTML dengan data dinamis
- [**Template ganda**](./multiple-template/) -- Menggunakan beberapa set template dalam satu aplikasi
- [**Bind binary tunggal dengan template**](./bind-single-binary-with-template/) -- Menyematkan template ke dalam binary yang dikompilasi
