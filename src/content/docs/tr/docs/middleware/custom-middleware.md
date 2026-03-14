---
title: "Özel Ara Katman"
sidebar:
  order: 3
---

Gin ara katmanı, `gin.HandlerFunc` döndüren bir fonksiyondur. Ara katman, ana işleyiciden önce ve/veya sonra çalışır ve bu da onu loglama, kimlik doğrulama, hata işleme ve diğer çapraz kesen konular için faydalı kılar.

### Ara katman yürütme akışı

Bir ara katman fonksiyonunun `c.Next()` çağrısıyla bölünen iki aşaması vardır:

- **`c.Next()` öncesi** -- Buradaki kod, istek ana işleyiciye ulaşmadan önce çalışır. Bu aşamayı başlangıç zamanını kaydetme, token doğrulama veya `c.Set()` ile context değerleri ayarlama gibi kurulum görevleri için kullanın.
- **`c.Next()`** -- Bu, zincirdeki bir sonraki işleyiciyi çağırır (başka bir ara katman veya son rota işleyicisi olabilir). Tüm alt akış işleyicileri tamamlanana kadar yürütme burada duraklar.
- **`c.Next()` sonrası** -- Buradaki kod, ana işleyici tamamlandıktan sonra çalışır. Bu aşamayı temizlik, yanıt durumu loglama veya gecikme ölçümü için kullanın.

Zinciri tamamen durdurmak istiyorsanız (örneğin, kimlik doğrulama başarısız olduğunda), `c.Next()` yerine `c.Abort()` çağırın. Bu, kalan işleyicilerin yürütülmesini engeller. Bir yanıtla birleştirebilirsiniz, örneğin `c.AbortWithStatusJSON(401, gin.H{"error": "unauthorized"})`.

```go
package main

import (
  "log"
  "time"

  "github.com/gin-gonic/gin"
)

func Logger() gin.HandlerFunc {
  return func(c *gin.Context) {
    t := time.Now()

    // Set example variable
    c.Set("example", "12345")

    // before request

    c.Next()

    // after request
    latency := time.Since(t)
    log.Print(latency)

    // access the status we are sending
    status := c.Writer.Status()
    log.Println(status)
  }
}

func main() {
  r := gin.New()
  r.Use(Logger())

  r.GET("/test", func(c *gin.Context) {
    example := c.MustGet("example").(string)

    // it would print: "12345"
    log.Println(example)
  })

  // Listen and serve on 0.0.0.0:8080
  r.Run(":8080")
}
```

### Deneyin

```bash
curl http://localhost:8080/test
```

Sunucu logları, `Logger` ara katmanından geçen her istek için istek gecikmesini ve HTTP durum kodunu gösterecektir.

## Ayrıca bakınız

- [Hata işleme ara katmanı](/tr/docs/middleware/error-handling-middleware/)
- [Ara katman kullanımı](/tr/docs/middleware/using-middleware/)

