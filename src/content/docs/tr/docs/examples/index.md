---
title: "🍳 Gin Tarifleri (Yemek Kitabı)"
sidebar:
  order: 6
---

## Giriş

Bu bölüm, küçük ve pratik tarifler aracılığıyla **kodunuzda Gin'i nasıl kullanacağınızı** gösterir.
Her tarif **tek bir konsepte** odaklanır, böylece hızlı öğrenebilir ve hemen uygulayabilirsiniz.

Bu örnekleri Gin kullanarak gerçek dünya API'leri yapılandırmak için referans olarak kullanın.

---

## 🧭 Neler öğreneceksiniz

Bu bölümde, aşağıdakileri kapsayan örnekler bulacaksınız:

- **Sunucu Temelleri**: Sunucu çalıştırma, yönlendirme ve yapılandırma.
- **İstek İşleme**: JSON, XML ve form verilerini bağlama.
- **Middleware**: Yerleşik ve özel middleware kullanma.
- **Render**: HTML, JSON, XML ve daha fazlasını sunma.
- **Güvenlik**: SSL, başlıklar ve kimlik doğrulamayı işleme.

---

## 🥇 Tarif 1: Minimal Gin Sunucusu

**Amaç:** Bir Gin sunucusu başlatmak ve temel bir isteği işlemek.

### Adımlar

1. Bir router oluşturun
2. Bir rota tanımlayın
3. Sunucuyu başlatın

```go
package main

import "github.com/gin-gonic/gin"

func main() {
  r := gin.Default()

  r.GET("/ping", func(c *gin.Context) {
    c.JSON(200, gin.H{
      "message": "pong",
    })
  })

  r.Run(":8080") // http://localhost:8080
}
```
