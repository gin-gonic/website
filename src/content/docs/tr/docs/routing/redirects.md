---
title: "Yönlendirmeler"
sidebar:
  order: 9
---

Gin, hem HTTP yönlendirmelerini (istemciyi farklı bir URL'ye gönderme) hem de yönlendirici yönlendirmelerini (istemciye gidiş-dönüş olmadan isteği dahili olarak farklı bir handler'a iletme) destekler.

## HTTP yönlendirmeleri

İstemciyi yönlendirmek için uygun bir HTTP durum koduyla `c.Redirect` kullanın:

- **301 (`http.StatusMovedPermanently`)** — kaynak kalıcı olarak taşındı. Tarayıcılar ve arama motorları önbelleklerini günceller.
- **302 (`http.StatusFound`)** — geçici yönlendirme. Tarayıcı takip eder ancak yeni URL'yi önbelleğe almaz.
- **307 (`http.StatusTemporaryRedirect`)** — 302 gibi, ancak tarayıcı orijinal HTTP metodunu korumalıdır (POST yönlendirmeleri için kullanışlıdır).
- **308 (`http.StatusPermanentRedirect`)** — 301 gibi, ancak tarayıcı orijinal HTTP metodunu korumalıdır.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  // External redirect (GET)
  router.GET("/old", func(c *gin.Context) {
    c.Redirect(http.StatusMovedPermanently, "https://www.google.com/")
  })

  // Redirect from POST -- use 302 or 307 to preserve behavior
  router.POST("/submit", func(c *gin.Context) {
    c.Redirect(http.StatusFound, "/result")
  })

  // Internal router redirect (no HTTP round-trip)
  router.GET("/test", func(c *gin.Context) {
    c.Request.URL.Path = "/final"
    router.HandleContext(c)
  })

  router.GET("/final", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{"hello": "world"})
  })

  router.GET("/result", func(c *gin.Context) {
    c.String(http.StatusOK, "Redirected here!")
  })

  router.Run(":8080")
}
```

## Test et

```sh
# GET redirect -- follows to Google (use -L to follow, -I to see headers only)
curl -I http://localhost:8080/old
# Output includes: HTTP/1.1 301 Moved Permanently
# Output includes: Location: https://www.google.com/

# POST redirect -- returns 302 with new location
curl -X POST -I http://localhost:8080/submit
# Output includes: HTTP/1.1 302 Found
# Output includes: Location: /result

# Internal redirect -- handled server-side, client sees final response
curl http://localhost:8080/test
# Output: {"hello":"world"}
```

:::caution
Bir POST handler'ından yönlendirme yaparken `301` yerine `302` veya `307` kullanın. Bir `301` yönlendirmesi bazı tarayıcıların metodu POST'tan GET'e değiştirmesine neden olabilir, bu da beklenmeyen davranışlara yol açabilir.
:::

:::tip
`router.HandleContext(c)` ile yapılan dahili yönlendirmeler istemciye yönlendirme yanıtı göndermez. İstek sunucu içinde yeniden yönlendirilir, bu daha hızlıdır ve istemci için görünmezdir.
:::

## Ayrıca bakınız

- [Rotaları gruplama](/tr/docs/routing/grouping-routes/)
