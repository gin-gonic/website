---
title: "Dosyadan veri sunma"
sidebar:
  order: 7
---

Gin, istemcilere dosya sunmak için çeşitli metodlar sağlar. Her metod farklı bir kullanım senaryosuna uygundur:

- **`c.File(path)`** -- Yerel dosya sisteminden bir dosya sunar. İçerik türü otomatik olarak algılanır. Derleme zamanında tam dosya yolunu bildiğinizde veya zaten doğruladığınızda kullanın.
- **`c.FileFromFS(path, fs)`** -- Bir `http.FileSystem` arayüzünden dosya sunar. Gömülü dosya sistemlerinden (`embed.FS`), özel depolama arka uçlarından dosya sunarken veya belirli bir dizin ağacına erişimi kısıtlamak istediğinizde faydalıdır.
- **`c.FileAttachment(path, filename)`** -- `Content-Disposition: attachment` başlığını ayarlayarak dosyayı indirme olarak sunar. Tarayıcı, diskteki orijinal dosya adından bağımsız olarak sağladığınız dosya adını kullanarak kullanıcıdan dosyayı kaydetmesini ister.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  // Serve a file inline (displayed in browser)
  router.GET("/local/file", func(c *gin.Context) {
    c.File("local/file.go")
  })

  // Serve a file from an http.FileSystem
  var fs http.FileSystem = http.Dir("/var/www/assets")
  router.GET("/fs/file", func(c *gin.Context) {
    c.FileFromFS("fs/file.go", fs)
  })

  // Serve a file as a downloadable attachment with a custom filename
  router.GET("/download", func(c *gin.Context) {
    c.FileAttachment("local/report-2024-q1.xlsx", "quarterly-report.xlsx")
  })

  router.Run(":8080")
}
```

İndirme uç noktasını curl ile test edebilirsiniz:

```sh
# The -v flag shows the Content-Disposition header
curl -v http://localhost:8080/download --output report.xlsx

# Serve a file inline
curl http://localhost:8080/local/file
```

Bir `io.Reader`'dan (uzak URL veya dinamik olarak oluşturulan içerik gibi) veri akışı için bunun yerine `c.DataFromReader()` kullanın. Ayrıntılar için [Reader'dan veri sunma](/tr/docs/rendering/serving-data-from-reader/) sayfasına bakın.

:::caution[Güvenlik: yol geçişi]
Kullanıcı girdisini asla doğrudan `c.File()` veya `c.FileAttachment()` fonksiyonlarına geçirmeyin. Bir saldırgan, sunucunuzdaki rastgele dosyaları okumak için `../../etc/passwd` gibi bir yol sağlayabilir. Her zaman dosya yollarını doğrulayın ve temizleyin veya erişimi belirli bir dizinle sınırlayan kısıtlanmış bir `http.FileSystem` ile `c.FileFromFS()` kullanın.

```go
// DANGEROUS -- never do this
router.GET("/files/:name", func(c *gin.Context) {
  c.File(c.Param("name")) // attacker controls the path
})

// SAFE -- restrict to a specific directory
var safeFS http.FileSystem = http.Dir("/var/www/public")
router.GET("/files/:name", func(c *gin.Context) {
  c.FileFromFS(c.Param("name"), safeFS)
})
```
:::
