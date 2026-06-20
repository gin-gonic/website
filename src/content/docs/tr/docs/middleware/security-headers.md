---
title: "Güvenlik Başlıkları"
sidebar:
  order: 7
---

Web uygulamanızı yaygın güvenlik açıklarından korumak için güvenlik başlıkları kullanmak önemlidir. Bu örnek, Gin uygulamanıza güvenlik başlıklarını nasıl ekleyeceğinizi ve Host Header Injection ile ilgili saldırılardan (SSRF, Açık Yönlendirme) nasıl kaçınacağınızı gösterir.

### Her başlığın neye karşı koruduğu

| Başlık | Amaç |
|--------|-------|
| `X-Content-Type-Options: nosniff` | MIME-türü koklama saldırılarını önler. Bu başlık olmadan, tarayıcılar dosyaları belirtilenden farklı bir içerik türü olarak yorumlayabilir ve saldırganların zararsız dosya türleri gibi gizlenmiş kötü amaçlı betikler çalıştırmasına izin verebilir (ör., aslında JavaScript olan bir `.jpg` yükleme). |
| `X-Frame-Options: DENY` | Sayfanın bir `<iframe>` içine yüklenmesini devre dışı bırakarak clickjacking'i önler. Saldırganlar, kullanıcıları gizli düğmelere tıklamaları için kandırmak üzere meşru sayfaların üzerine görünmez çerçeveler yerleştirmek için clickjacking kullanır (ör., "Hesabımı sil"). |
| `Content-Security-Policy` | Tarayıcının hangi kaynakları (betikler, stiller, görüntüler, yazı tipleri vb.) yüklemesine izin verildiğini ve hangi kökenlerden yükleneceğini kontrol eder. Bu, satır içi betikleri engelleyebildiği ve betik kaynaklarını kısıtlayabildiği için XSS'ye karşı en etkili savunmalardan biridir. |
| `X-XSS-Protection: 1; mode=block` | Tarayıcının yerleşik XSS filtresini etkinleştirir. Bu başlık modern tarayıcılarda büyük ölçüde kullanımdan kaldırılmıştır (Chrome 2019'da XSS Auditor'ını kaldırdı), ancak yine de eski tarayıcılardaki kullanıcılar için derinlemesine savunma sağlar. |
| `Strict-Transport-Security` | Tarayıcıyı belirtilen `max-age` süresi boyunca alana yapılan tüm gelecekteki istekler için HTTPS kullanmaya zorlar. Bu, güvensiz HTTP bağlantıları üzerinden protokol düşürme saldırılarını ve çerez ele geçirmesini önler. `includeSubDomains` yönergesi bu korumayı tüm alt alanlara genişletir. |
| `Referrer-Policy: strict-origin` | Giden isteklerle ne kadar referrer bilgisi gönderileceğini kontrol eder. Bu başlık olmadan, tam URL (token veya hassas veriler içerebilen sorgu parametreleri dahil) üçüncü taraf sitelere sızabilir. `strict-origin` yalnızca kökeni (alan) gönderir ve yalnızca HTTPS üzerinden. |
| `Permissions-Policy` | Sayfa tarafından hangi tarayıcı özelliklerinin (konum, kamera, mikrofon vb.) kullanılabileceğini kısıtlar. Bir saldırgan betik enjekte etmeyi başarırsa, bu betikler hassas cihaz API'lerine erişemeyeceğinden hasarı sınırlar. |

### Örnek

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  r := gin.Default()

  expectedHost := "localhost:8080"

  // Setup Security Headers
  r.Use(func(c *gin.Context) {
    if c.Request.Host != expectedHost {
      c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Invalid host header"})
      return
    }
    c.Header("X-Frame-Options", "DENY")
    c.Header("Content-Security-Policy", "default-src 'self'; connect-src *; font-src *; script-src-elem * 'unsafe-inline'; img-src * data:; style-src * 'unsafe-inline';")
    c.Header("X-XSS-Protection", "1; mode=block")
    c.Header("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
    c.Header("Referrer-Policy", "strict-origin")
    c.Header("X-Content-Type-Options", "nosniff")
    c.Header("Permissions-Policy", "geolocation=(),midi=(),sync-xhr=(),microphone=(),camera=(),magnetometer=(),gyroscope=(),fullscreen=(self),payment=()")
    c.Next()
  })

  r.GET("/ping", func(c *gin.Context) {
    c.JSON(200, gin.H{
      "message": "pong",
    })
  })

  r.Run() // listen and serve on 0.0.0.0:8080
}
```

`curl` ile test edebilirsiniz:

```bash
// Check Headers

curl localhost:8080/ping -I

HTTP/1.1 404 Not Found
Content-Security-Policy: default-src 'self'; connect-src *; font-src *; script-src-elem * 'unsafe-inline'; img-src * data:; style-src * 'unsafe-inline';
Content-Type: text/plain
Permissions-Policy: geolocation=(),midi=(),sync-xhr=(),microphone=(),camera=(),magnetometer=(),gyroscope=(),fullscreen=(self),payment=()
Referrer-Policy: strict-origin
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-Xss-Protection: 1; mode=block
Date: Sat, 30 Mar 2024 08:20:44 GMT
Content-Length: 18

// Check Host Header Injection

curl localhost:8080/ping -I -H "Host:neti.ee"

HTTP/1.1 400 Bad Request
Content-Type: application/json; charset=utf-8
Date: Sat, 30 Mar 2024 08:21:09 GMT
Content-Length: 31
```

İsteğe bağlı olarak, [gin helmet](https://github.com/danielkov/gin-helmet) `go get github.com/danielkov/gin-helmet/ginhelmet` kullanabilirsiniz

```go
package main

import (
  "github.com/gin-gonic/gin"
  "github.com/danielkov/gin-helmet/ginhelmet"
)

func main() {
  r := gin.Default()

  // Use default security headers
  r.Use(ginhelmet.Default())

  r.GET("/", func(c *gin.Context) {
    c.JSON(200, gin.H{"message": "Hello, World!"})
  })

  r.Run()
}
```
