---
title: "Sunucu Yapılandırması"
sidebar:
  order: 8
---

Gin, esnek sunucu yapılandırma seçenekleri sunar. `gin.Engine` `http.Handler` arayüzünü uyguladığından, zaman aşımlarını, TLS'i ve diğer ayarları doğrudan kontrol etmek için Go'nun standart `net/http.Server`'ı ile kullanabilirsiniz.

## Özel http.Server kullanımı

Varsayılan olarak, `router.Run()` basit bir HTTP sunucusu başlatır. Üretim kullanımı için, zaman aşımlarını ve diğer seçenekleri ayarlamak üzere kendi `http.Server`'ınızı oluşturun:

```go
func main() {
  router := gin.Default()
  router.GET("/", func(c *gin.Context) {
    c.String(200, "ok")
  })

  s := &http.Server{
    Addr:           ":8080",
    Handler:        router,
    ReadTimeout:    10 * time.Second,
    WriteTimeout:   10 * time.Second,
    MaxHeaderBytes: 1 << 20,
  }
  s.ListenAndServe()
}
```

Bu, Gin'in tüm yönlendirme ve ara katman yeteneklerini korurken Go'nun sunucu yapılandırmasına tam erişim sağlar.

## Bu bölümde

- [**Özel HTTP yapılandırması**](./custom-http-config/) -- Temel HTTP sunucusunu ince ayarlama
- [**Özel JSON codec'i**](./custom-json-codec/) -- Alternatif JSON serileştirme kütüphaneleri kullanma
- [**Let's Encrypt**](./lets-encrypt/) -- Let's Encrypt ile otomatik TLS sertifikaları
- [**Birden fazla servis çalıştırma**](./multiple-service/) -- Farklı portlarda birden fazla Gin motoru sunma
- [**Zarif yeniden başlatma veya durdurma**](./graceful-restart-or-stop/) -- Aktif bağlantıları düşürmeden kapatma
- [**HTTP/2 sunucu push**](./http2-server-push/) -- İstemciye proaktif olarak kaynak gönderme
- [**Çerez işleme**](./cookie/) -- HTTP çerezlerini okuma ve yazma
- [**Güvenilir proxy'ler**](./trusted-proxies/) -- İstemci IP çözümlemesi için Gin'in hangi proxy'lere güveneceğini yapılandırma
