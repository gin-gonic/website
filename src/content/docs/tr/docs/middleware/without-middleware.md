---
title: "Varsayılan olarak ara katmansız"
sidebar:
  order: 1
---

Gin, bir yönlendirici motoru oluşturmanın iki yolunu sunar ve aradaki fark, varsayılan olarak hangi ara katmanın eklendiğidir.

### `gin.Default()` -- Logger ve Recovery ile

`gin.Default()`, iki ara katman zaten eklenmiş bir yönlendirici oluşturur:

- **Logger** -- İstek loglarını stdout'a yazar (metod, yol, durum kodu, gecikme).
- **Recovery** -- İşleyicilerdeki herhangi bir panic'ten kurtarır ve sunucunuzun çökmesini önleyerek 500 yanıtı döndürür.

Bu, hızlıca başlamak için en yaygın seçimdir.

### `gin.New()` -- boş bir motor

`gin.New()`, **hiçbir ara katman** eklenmemiş tamamen boş bir yönlendirici oluşturur. Hangi ara katmanın çalışacağı üzerinde tam kontrol istediğinizde faydalıdır, örneğin:

- Varsayılan metin logger yerine yapılandırılmış bir logger (`slog` veya `zerolog` gibi) kullanmak istiyorsanız.
- Panic kurtarma davranışını özelleştirmek istiyorsanız.
- Minimum veya özelleştirilmiş bir ara katman yığını gerektiren bir mikro hizmet oluşturuyorsanız.

### Örnek

```go
package main

import (
  "log"
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  // Create a blank engine with no middleware.
  r := gin.New()

  // Attach only the middleware you need.
  r.Use(gin.Recovery())

  r.GET("/ping", func(c *gin.Context) {
    c.String(http.StatusOK, "pong")
  })

  log.Fatal(r.Run(":8080"))
}
```

Yukarıdaki örnekte, çökmeleri önlemek için Recovery ara katmanı dahil edilmiştir, ancak varsayılan Logger ara katmanı dahil edilmemiştir. Kendi loglama ara katmanınızla değiştirebilir veya tamamen çıkarabilirsiniz.
