---
title: "İşleme (Rendering)"
sidebar:
  order: 5
---

Gin, JSON, XML, YAML, ProtoBuf, HTML ve daha fazlası dahil olmak üzere birden fazla formatta yanıt işlemeyi destekler. Her işleme metodu aynı kalıbı izler: `*gin.Context` üzerinde bir HTTP durum kodu ve serileştirilecek veri ile bir metod çağırın. Gin, content-type başlıklarını, serileştirmeyi ve yanıt yazmayı otomatik olarak işler.

```go
// All rendering methods share this pattern:
c.JSON(http.StatusOK, data)   // application/json
c.XML(http.StatusOK, data)    // application/xml
c.YAML(http.StatusOK, data)   // application/x-yaml
c.TOML(http.StatusOK, data)   // application/toml
c.ProtoBuf(http.StatusOK, data) // application/x-protobuf
```

Aynı veriden tek bir işleyicide birden fazla formatta sunmak için `Accept` başlığını veya bir sorgu parametresini kullanabilirsiniz:

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

## Bu bölümde

- [**XML/JSON/YAML/ProtoBuf işleme**](./rendering/) -- Otomatik content-type işleme ile birden fazla formatta yanıt işleme
- [**SecureJSON**](./secure-json/) -- Eski tarayıcılarda JSON ele geçirme saldırılarını önleme
- [**JSONP**](./jsonp/) -- CORS olmadan eski istemcilerden çapraz alan isteklerini destekleme
- [**AsciiJSON**](./ascii-json/) -- Güvenli aktarım için ASCII olmayan karakterleri kaçışlama
- [**PureJSON**](./pure-json/) -- HTML karakterlerini kaçışlamadan JSON işleme
- [**Statik dosya sunma**](./serving-static-files/) -- Statik varlık dizinlerini sunma
- [**Dosyadan veri sunma**](./serving-data-from-file/) -- Tek tek dosyaları, ekleri ve indirmeleri sunma
- [**Reader'dan veri sunma**](./serving-data-from-reader/) -- Herhangi bir `io.Reader`'dan yanıta veri akışı
- [**HTML işleme**](./html-rendering/) -- Dinamik veri ile HTML şablonlarını işleme
- [**Çoklu şablon**](./multiple-template/) -- Tek bir uygulamada birden fazla şablon seti kullanma
- [**Şablonlu tekli ikili oluşturma**](./bind-single-binary-with-template/) -- Şablonları derlenmiş ikili dosyanıza gömme
