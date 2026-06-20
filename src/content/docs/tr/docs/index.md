---
title: "Dokümantasyon"
sidebar:
  order: 20
---

Gin, [Go](https://go.dev/) ile yazılmış yüksek performanslı bir HTTP web framework'üdür. Martini benzeri bir API sunar ancak [httprouter](https://github.com/julienschmidt/httprouter) sayesinde 40 kata kadar daha iyi performans sağlar. Gin, hız ve geliştirici verimliliğinin önemli olduğu REST API'leri, web uygulamaları ve mikro hizmetler oluşturmak için tasarlanmıştır.

**Neden Gin'i seçmelisiniz?**

Gin, Express.js tarzı yönlendirmenin basitliğini Go'nun performans özellikleriyle birleştirir ve şunlar için idealdir:

- Yüksek verimli REST API'leri oluşturma
- Çok sayıda eşzamanlı isteği işlemesi gereken mikro hizmetler geliştirme
- Hızlı yanıt süreleri gerektiren web uygulamaları oluşturma
- Minimum şablon koduyla hızlıca web servisleri prototipleme

**Gin'in temel özellikleri:**

- **Sıfır tahsisli yönlendirici** - Son derece bellek verimli yönlendirme, heap tahsisi yok
- **Yüksek performans** - Karşılaştırma testleri diğer Go web framework'lerine kıyasla üstün hız gösterir
- **Ara katman desteği** - Kimlik doğrulama, loglama, CORS vb. için genişletilebilir ara katman sistemi
- **Çökme koruması** - Yerleşik kurtarma ara katmanı, panic'lerin sunucunuzu çökertmesini önler
- **JSON doğrulama** - Otomatik istek/yanıt JSON bağlama ve doğrulama
- **Rota gruplama** - İlgili rotaları düzenleyin ve ortak ara katman uygulayın
- **Hata yönetimi** - Merkezi hata işleme ve loglama
- **Yerleşik işleme** - JSON, XML, HTML şablonları ve daha fazlası için destek
- **Genişletilebilir** - Geniş topluluk ara katman ve eklenti ekosistemi

## Başlarken

### Ön Koşullar

- **Go sürümü**: Gin, [Go](https://go.dev/) sürüm [1.25](https://go.dev/doc/devel/release#go1.25) veya üstünü gerektirir
- **Temel Go bilgisi**: Go sözdizimi ve paket yönetimi hakkında bilgi sahibi olmak faydalıdır

### Kurulum

[Go'nun modül desteği](https://go.dev/wiki/Modules#how-to-use-modules) ile kodunuzda Gin'i içe aktarmanız yeterlidir ve Go derleme sırasında otomatik olarak indirecektir:

```go
import "github.com/gin-gonic/gin"
```

### İlk Gin Uygulamanız

İşte Gin'in basitliğini gösteren eksiksiz bir örnek:

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  // Create a Gin router with default middleware (logger and recovery)
  r := gin.Default()

  // Define a simple GET endpoint
  r.GET("/ping", func(c *gin.Context) {
    // Return JSON response
    c.JSON(http.StatusOK, gin.H{
      "message": "pong",
    })
  })

  // Start server on port 8080 (default)
  // Server will listen on 0.0.0.0:8080 (localhost:8080 on Windows)
  r.Run()
}
```

**Uygulamayı çalıştırma:**

1. Yukarıdaki kodu `main.go` olarak kaydedin
2. Uygulamayı çalıştırın:

   ```sh
   go run main.go
   ```

3. Tarayıcınızı açın ve [`http://localhost:8080/ping`](http://localhost:8080/ping) adresini ziyaret edin
4. Şunu görmelisiniz: `{"message":"pong"}`

**Bu örneğin gösterdiği şeyler:**

- Varsayılan ara katman ile bir Gin yönlendiricisi oluşturma
- Basit işleyici fonksiyonlarıyla HTTP uç noktaları tanımlama
- JSON yanıtları döndürme
- Bir HTTP sunucusu başlatma

### Sonraki Adımlar

İlk Gin uygulamanızı çalıştırdıktan sonra, daha fazla bilgi edinmek için bu kaynakları keşfedin:

#### Öğrenme Kaynakları

- **[Gin Hızlı Başlangıç Kılavuzu](./quickstart/)** - API örnekleri ve derleme yapılandırmalarını içeren kapsamlı rehber
- **[Örnek Deposu](https://github.com/gin-gonic/examples)** - Çeşitli Gin kullanım senaryolarını gösteren çalıştırmaya hazır örnekler:
  - REST API geliştirme
  - Kimlik doğrulama ve ara katman
  - Dosya yükleme ve indirme
  - WebSocket bağlantıları
  - Şablon işleme

### Resmi Eğitimler

- [Go.dev Eğitimi: Go ve Gin ile RESTful API Geliştirme](https://go.dev/doc/tutorial/web-service-gin)

## Ara Katman Ekosistemi

Gin, yaygın web geliştirme ihtiyaçları için zengin bir ara katman ekosistemine sahiptir. Topluluk tarafından geliştirilen ara katmanları keşfedin:

- **[gin-contrib](https://github.com/gin-contrib)** - Resmi ara katman koleksiyonu, içerir:
  - Kimlik doğrulama (JWT, Basic Auth, Sessions)
  - CORS, Hız sınırlama, Sıkıştırma
  - Loglama, Metrikler, İzleme
  - Statik dosya sunma, Şablon motorları

- **[gin-gonic/contrib](https://github.com/gin-gonic/contrib)** - Ek topluluk ara katmanları
