---
title: "Reader'dan veri sunma"
sidebar:
  order: 8
---

`DataFromReader`, tüm içeriği önce bellekte tamponlamadan herhangi bir `io.Reader`'dan doğrudan HTTP yanıtına veri akışı yapmanıza olanak tanır. Bu, proxy uç noktaları oluşturmak veya uzak kaynaklardan büyük dosyaları verimli bir şekilde sunmak için çok önemlidir.

**Yaygın kullanım senaryoları:**

- **Uzak kaynakları proxy'leme** -- Harici bir servisten (bulut depolama API'si veya CDN gibi) bir dosya alıp istemciye yönlendirme. Veri, tamamen belleğe yüklenmeden sunucunuzdan geçer.
- **Oluşturulan içerik sunma** -- Dinamik olarak oluşturulan verileri (CSV dışa aktarmaları veya rapor dosyaları gibi) üretildikçe akışa alma.
- **Büyük dosya indirmeleri** -- Bellekte tutmak için çok büyük dosyaları, diskten veya uzak bir kaynaktan parçalar halinde okuyarak sunma.

Metod imzası `c.DataFromReader(code, contentLength, contentType, reader, extraHeaders)` şeklindedir. HTTP durum kodunu, içerik uzunluğunu (istemcinin toplam boyutu bilmesi için), MIME türünü, akış yapılacak `io.Reader`'ı ve isteğe bağlı ek yanıt başlıkları haritasını (dosya indirmeleri için `Content-Disposition` gibi) sağlarsınız.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()
  router.GET("/someDataFromReader", func(c *gin.Context) {
    response, err := http.Get("https://raw.githubusercontent.com/gin-gonic/logo/master/color.png")
    if err != nil || response.StatusCode != http.StatusOK {
      c.Status(http.StatusServiceUnavailable)
      return
    }

    reader := response.Body
    contentLength := response.ContentLength
    contentType := response.Header.Get("Content-Type")

    extraHeaders := map[string]string{
      "Content-Disposition": `attachment; filename="gopher.png"`,
    }

    c.DataFromReader(http.StatusOK, contentLength, contentType, reader, extraHeaders)
  })
  router.Run(":8080")
}
```

Bu örnekte, Gin GitHub'dan bir görsel alır ve doğrudan istemciye indirilebilir bir ek olarak akışa alır. Görsel baytları, üst akış HTTP yanıt gövdesinden istemci yanıtına bir tamponda biriktirilmeden akar. `response.Body`'nin, `DataFromReader` yanıt yazma sırasında tamamen okuduğu için, işleyici döndükten sonra HTTP sunucusu tarafından otomatik olarak kapatıldığını unutmayın.
