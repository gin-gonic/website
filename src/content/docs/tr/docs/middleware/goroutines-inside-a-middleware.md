---
title: "Ara katmanda goroutine'ler"
sidebar:
  order: 6
---

Bir ara katman veya işleyici içinde yeni Goroutine'ler başlatırken, içinde orijinal context'i **KULLANMAMALISINIZ**, salt okunur bir kopya kullanmanız gerekir.

### `c.Copy()` neden gereklidir

Gin, performans için istekler arasında `gin.Context` nesnelerini yeniden kullanmak üzere bir **sync.Pool** kullanır. Bir işleyici döndüğünde, `gin.Context` havuza geri döner ve tamamen farklı bir isteğe atanabilir. Bir goroutine bu noktada hâlâ orijinal context'e bir referans tutuyorsa, artık başka bir isteğe ait olan alanları okuyacak veya yazacaktır. Bu, **yarış koşullarına**, **veri bozulmasına** veya **panic'lere** yol açar.

`c.Copy()` çağrısı, işleyici döndükten sonra kullanılması güvenli olan context'in bir anlık görüntüsünü oluşturur. Kopya, istek, URL, anahtarlar ve diğer salt okunur verileri içerir, ancak havuz yaşam döngüsünden ayrılmıştır.

```go
package main

import (
  "log"
  "time"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.GET("/long_async", func(c *gin.Context) {
    // create copy to be used inside the goroutine
    cCp := c.Copy()
    go func() {
      // simulate a long task with time.Sleep(). 5 seconds
      time.Sleep(5 * time.Second)

      // note that you are using the copied context "cCp", IMPORTANT
      log.Println("Done! in path " + cCp.Request.URL.Path)
    }()
  })

  router.GET("/long_sync", func(c *gin.Context) {
    // simulate a long task with time.Sleep(). 5 seconds
    time.Sleep(5 * time.Second)

    // since we are NOT using a goroutine, we do not have to copy the context
    log.Println("Done! in path " + c.Request.URL.Path)
  })

  // Listen and serve on 0.0.0.0:8080
  router.Run(":8080")
}
```
