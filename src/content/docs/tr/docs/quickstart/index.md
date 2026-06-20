---
title: "Hızlı Başlangıç"
sidebar:
  order: 2
---

Gin hızlı başlangıç rehberine hoş geldiniz! Bu kılavuz, Gin'i kurma, bir proje oluşturma ve ilk API'nizi çalıştırma adımlarında size yol gösterir; böylece güvenle web servisleri oluşturmaya başlayabilirsiniz.

## Ön Koşullar

- **Go sürümü**: Gin, [Go](https://go.dev/) sürüm [1.25](https://go.dev/doc/devel/release#go1.25) veya üstünü gerektirir
- Go'nun `PATH`'inizde olduğunu ve terminalinizden kullanılabilir olduğunu doğrulayın. Go kurulumu için [resmi dokümanlara bakın](https://go.dev/doc/install).

---

## Adım 1: Gin'i Kurun ve Projenizi Başlatın

Yeni bir proje klasörü oluşturarak ve bir Go modülü başlatarak başlayın:

```sh
mkdir gin-quickstart && cd gin-quickstart
go mod init gin-quickstart
```

Gin'i bağımlılık olarak ekleyin:

```sh
go get -u github.com/gin-gonic/gin
```

---

## Adım 2: İlk Gin Uygulamanızı Oluşturun

`main.go` adında bir dosya oluşturun:

```sh
touch main.go
```

`main.go` dosyasını açın ve aşağıdaki kodu ekleyin:

```go
package main

import "github.com/gin-gonic/gin"

func main() {
  router := gin.Default()
  router.GET("/ping", func(c *gin.Context) {
    c.JSON(200, gin.H{
      "message": "pong",
    })
  })
  router.Run() // listens on 0.0.0.0:8080 by default
}
```

---

## Adım 3: API Sunucunuzu Çalıştırın

Sunucunuzu şu komutla başlatın:

```sh
go run main.go
```

Tarayıcınızda [http://localhost:8080/ping](http://localhost:8080/ping) adresine gidin, şunu görmelisiniz:

```json
{"message":"pong"}
```

---

## Ek Örnek: net/http ile Gin Kullanımı

Yanıt kodları için `net/http` sabitlerini kullanmak istiyorsanız, onu da içe aktarın:

```go
package main

import (
  "github.com/gin-gonic/gin"
  "net/http"
)

func main() {
  router := gin.Default()
  router.GET("/ping", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{
      "message": "pong",
    })
  })
  router.Run()
}
```

---

## İpuçları ve Kaynaklar

- Go'da yeni misiniz? Go kodu yazmayı ve çalıştırmayı [resmi Go dokümantasyonunda](https://go.dev/doc/code) öğrenin.
- Gin kavramlarını uygulamalı olarak pratik yapmak mı istiyorsunuz? Etkileşimli alıştırmalar ve eğitimler için [Öğrenme Kaynakları](../learning-resources) sayfamıza göz atın.
- Tam özellikli bir örneğe mi ihtiyacınız var? Şununla hızlıca başlayın:

  ```sh
  curl https://raw.githubusercontent.com/gin-gonic/examples/master/basic/main.go > main.go
  ```

- Daha ayrıntılı dokümantasyon için [Gin kaynak kodu dokümanlarını](https://github.com/gin-gonic/gin/blob/master/docs/doc.md) ziyaret edin.
