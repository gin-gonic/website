---
title: "Yönlendirme"
sidebar:
  order: 3
---

Gin, yüksek performanslı URL eşleştirmesi için [httprouter](https://github.com/julienschmidt/httprouter) üzerine kurulmuş güçlü bir yönlendirme sistemi sunar. Arka planda httprouter, rotaları depolamak ve aramak için bir [radix ağacı](https://en.wikipedia.org/wiki/Radix_tree) (sıkıştırılmış trie olarak da bilinir) kullanır; bu da rota eşleştirmesinin son derece hızlı olduğu ve arama başına sıfır bellek tahsisi gerektirdiği anlamına gelir. Bu, Gin'i mevcut en hızlı Go web framework'lerinden biri yapar.

Rotalar, motor (veya bir rota grubu) üzerinde bir HTTP metodu çağrılarak ve bir URL deseni ile birlikte bir veya daha fazla işleyici fonksiyon sağlanarak kaydedilir:

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.GET("/hello", func(c *gin.Context) {
    c.String(http.StatusOK, "Hello, World!")
  })

  router.POST("/users", func(c *gin.Context) {
    name := c.PostForm("name")
    c.JSON(http.StatusCreated, gin.H{"user": name})
  })

  router.Run(":8080")
}
```

## Bu bölümde

Aşağıdaki sayfalar her yönlendirme konusunu ayrıntılı olarak kapsar:

- [**HTTP metodu kullanımı**](./http-method/) -- GET, POST, PUT, DELETE, PATCH, HEAD ve OPTIONS için rota kaydetme.
- [**Yol parametreleri**](./param-in-path/) -- URL yollarından dinamik segmentleri yakalama (ör. `/user/:name`).
- [**Sorgu dizesi parametreleri**](./querystring-param/) -- İstek URL'sinden sorgu dizesi değerlerini okuma.
- [**Sorgu ve post formu**](./query-and-post-form/) -- Aynı işleyicide hem sorgu dizesi hem de POST form verilerine erişme.
- [**Sorgu dizesi veya postform olarak map**](./map-as-querystring-or-postform/) -- Sorgu dizelerinden veya POST formlarından map parametrelerini bağlama.
- [**Multipart/urlencoded form**](./multipart-urlencoded-form/) -- `multipart/form-data` ve `application/x-www-form-urlencoded` gövdelerini ayrıştırma.
- [**Dosya yükleme**](./upload-file/) -- Tekli ve çoklu dosya yüklemelerini işleme.
- [**Rota gruplama**](./grouping-routes/) -- Rotaları ortak ön ekler altında paylaşımlı ara katmanlarla düzenleme.
- [**Yönlendirmeler**](./redirects/) -- HTTP ve yönlendirici düzeyinde yönlendirmeler yapma.
