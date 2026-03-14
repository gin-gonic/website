---
title: "XML/JSON/YAML/ProtoBuf işleme"
sidebar:
  order: 1
---

Gin, JSON, XML, YAML ve Protocol Buffers dahil olmak üzere birden fazla formatta yanıt işleme için yerleşik destek sağlar. Bu, içerik müzakeresi destekleyen API'ler oluşturmayı kolaylaştırır -- istemcinin istediği formatta veri sunma.

**Her formatın ne zaman kullanılacağı:**

- **JSON** -- REST API'leri ve tarayıcı tabanlı istemciler için en yaygın seçenek. Standart çıktı için `c.JSON()` veya geliştirme sırasında insan tarafından okunabilir biçimlendirme için `c.IndentedJSON()` kullanın.
- **XML** -- Eski sistemler, SOAP servisleri veya XML bekleyen istemcilerle (bazı kurumsal uygulamalar gibi) entegrasyon için faydalıdır.
- **YAML** -- Yapılandırma odaklı uç noktalar veya YAML'ı doğal olarak tüketen araçlar (Kubernetes veya CI/CD ardışık düzenleri gibi) için iyi bir seçimdir.
- **ProtoBuf** -- Servisler arası yüksek performanslı, düşük gecikmeli iletişim için idealdir. Protocol Buffers, metin tabanlı formatlara kıyasla daha küçük yükler ve daha hızlı serileştirme üretir, ancak paylaşılan bir şema tanımı (`.proto` dosyası) gerektirir.

Tüm işleme metodları bir HTTP durum kodu ve bir veri değeri kabul eder. Gin veriyi serileştirir ve uygun `Content-Type` başlığını otomatik olarak ayarlar.

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

## Ayrıca bakınız

- [PureJSON](/tr/docs/rendering/pure-json/)
- [SecureJSON](/tr/docs/rendering/secure-json/)
- [AsciiJSON](/tr/docs/rendering/ascii-json/)
- [JSONP](/tr/docs/rendering/jsonp/)
