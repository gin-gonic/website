---
title: "Dokümantasyon"
sidebar:
  order: 20
---

Gin, [Go](https://go.dev/) ile yazılmış yüksek performanslı bir HTTP web framework'üdür. Martini benzeri bir API sunar ancak [httprouter](https://github.com/julienschmidt/httprouter) sayesinde Martini'den çok daha hızlıdır—40 kata kadar daha yüksek performans. Gin, hız ve geliştirici verimliliğinin kritik olduğu REST API'ler, web uygulamaları ve mikro servisler geliştirmek için tasarlanmıştır.

**Neden Gin?**

Gin, Express.js tarzı yönlendirme yapısının sadeliğini Go'nun performansı ile birleştirerek şunlar için ideal bir seçenektir:

- Yüksek hızlı REST API geliştirme
- Çok sayıda eşzamanlı isteği karşılayan mikro servisler oluşturma
- Hızlı yanıt gerektiren web uygulamaları geliştirme
- En az yapılandırma ile web servislerini hızlıca prototipleme

**Gin'in Başlıca Özellikleri:**

- **Sıfır bellek tahsisi ile yönlendirme** – Yığın ayırtıcı olmadan son derece verimli yönlendirme
- **Yüksek performans** – Benchmarkt'larda diğer Go web framework'lerine kıyasla üstün hız
- **Ara katman (middleware) desteği** – Kimlik doğrulama, loglama, CORS vb. için genişletilebilir sistem
- **Çökme korumalı (Crash-free)** – Dahili kurtarma ara katmanı ile sunucu hatalardan dolayı kapanmaz
- **JSON doğrulama** – Otomatik JSON request/response bağlama ve doğrulama
- **Rota gruplama** – İlgili rotaların bir arada gruplanması ve ortak middleware uygulanması
- **Hata yönetimi** – Merkezî hata işleme ve loglama
- **Yerleşik render** – JSON, XML, HTML şablonları ve daha fazlası için destek
- **Genişletilebilir** – Büyük topluluk middleware ve eklenti ekosistemi

## Başlangıç

### Ön Gereksinimler

- **Go sürümü:** Gin, [Go](https://go.dev/) sürüm [1.23](https://go.dev/doc/devel/release#go1.23.0) veya sonrasını gerektirir
- **Temel Go bilgisi:** Go dili söz dizimi ve paket yönetimine hâkim olmak faydalı olur

### Kurulum

[Go Modül desteği](https://go.dev/wiki/Modules#how-to-use-modules) ile kodunuzda Gin'i import edin; derleme sırasında Go otomatik olarak indirecektir:

```go
import "github.com/gin-gonic/gin"
```

### İlk Gin Uygulamanız

Gin'in sadeliğini gösteren tam bir örnek:

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  // Varsayılan middleware'leriyle (logger ve recovery) Gin router oluştur
  r := gin.Default()
  
  // Basit bir GET endpoint tanımla
  r.GET("/ping", func(c *gin.Context) {
    // JSON yanıtı döndür
    c.JSON(http.StatusOK, gin.H{
      "message": "pong",
    })
  })
  
  // Sunucuyu 8080 portunda başlat (varsayılan)
  // Sunucu 0.0.0.0:8080'de dinler (Windows'da localhost:8080)
  r.Run()
}
```

**Uygulamanın çalıştırılması:**

1. Yukarıdaki kodu `main.go` olarak kaydedin
2. Uygulamayı çalıştırın:

   ```sh
   go run main.go
   ```

3. Tarayıcınızı açıp [`http://localhost:8080/ping`](http://localhost:8080/ping) adresine girin
4. Şu çıktıyı göreceksiniz: `{"message":"pong"}`

**Örnekten Öğrenilecekler:**

- Varsayılan middleware'li Gin router oluşturmak
- Basit handler fonksiyonlarla HTTP endpoint tanımlama
- JSON yanıtı döndürmek
- HTTP sunucusu başlatmak

### Sonraki Adımlar

İlk Gin uygulamanızdan sonra daha fazlasını öğrenmek için aşağıdaki kaynakları inceleyin:

#### 📚 Öğrenme Kaynakları

- **[Gin Hızlı Başlangıç Kılavuzu](./quickstart/)** – API örnekleri ve derleme ayarlarıyla kapsamlı bir eğitim
- **[Örnek Repo](https://github.com/gin-gonic/examples)** – Farklı Gin kullanım senaryolarını gösteren hazır örnekler:
  - REST API geliştirme
  - Kimlik doğrulama & middleware
  - Dosya yükleme/indirme
  - WebSocket bağlantıları
  - Şablon render etme

### Resmi Eğitimler

- [Go.dev Eğitim: Go ve Gin ile RESTful API geliştirme](https://go.dev/doc/tutorial/web-service-gin)

## 🔌 Middleware Ekosistemi

Gin, yaygın web geliştirme ihtiyaçları için zengin topluluk middleware'lerine sahiptir. Topluluk katkılı middleware'leri keşfedin:

- **[gin-contrib](https://github.com/gin-contrib)** – Resmi middleware koleksiyonu, şunları içerir:
  - Kimlik doğrulama (JWT, Basic Auth, Session)
  - CORS, hız sınırlama, sıkıştırma
  - Loglama, metrik, tracing
  - Statik dosya servisi, şablon motorları
  
- **[gin-gonic/contrib](https://github.com/gin-gonic/contrib)** – Ek topluluk middleware'leri
