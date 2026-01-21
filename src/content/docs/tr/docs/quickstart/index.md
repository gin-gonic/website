---
title: "Hızlı Başlangıç"
sidebar:
  order: 2
---

Gin Hızlı Başlangıç rehberine hoş geldiniz! Bu rehberde Gin’in kurulumu, projenizin yapılandırılması ve ilk API’nizin çalıştırılması adımlarını kolay anlaşılır şekilde öğrenecek, web servislerinizi güvenle inşa edebileceksiniz.

## Ön Gereksinimler

- **Go sürümü**: Gin, [Go](https://go.dev/) sürümü [1.24](https://go.dev/doc/devel/release#go1.24) veya üstünü gerektirir
- Go’nun `PATH`'inize ekli olduğundan ve terminalden çalıştığından emin olun. Kurulum için [resmi belgeleri inceleyin](https://golang.org/doc/install).

---

## Adım 1: Gin’i Kur ve Projeni Başlat

Yeni bir proje dizini oluşturup Go modülünü başlatın:

```sh
mkdir gin-quickstart && cd gin-quickstart
go mod init gin-quickstart
```

Gin’i projeye ekleyin:

```sh
go get -u github.com/gin-gonic/gin
```

---

## Adım 2: İlk Gin Uygulamanı Oluştur

`main.go` dosyasını oluşturun:

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
  router.Run() // varsayılan olarak 0.0.0.0:8080’de dinler
}
```

---

## Adım 3: API Sunucunu Çalıştır

Sunucuyu başlatmak için:

```sh
go run main.go
```

Tarayıcıda [http://localhost:8080/ping](http://localhost:8080/ping) adresine git ve aşağıdaki çıktıyı görmelisin:

```json
{"message":"pong"}
```

---

## Ekstra Örnek: Gin ile net/http Kullanmak

Yanıt kodlarını belirlemek için `net/http` sabitlerini kullanmak istersen, onu da ekleyebilirsin:

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

- Go'ya yeni misin? Go kodu yazmayı ve çalıştırmayı [buradan öğrenebilirsin](https://golang.org/doc/code.html).
- Gin kavramlarını pratik yapmaya hazır mısın? Etkileşimli görevler ve öğreticiler için [Öğrenme Kaynaklarımızı](../learning-resources) incele.
- Daha kapsamlı bir örnek için şu komutu kullanabilirsin:

  ```sh
  curl https://raw.githubusercontent.com/gin-gonic/examples/master/basic/main.go > main.go
  ```

- Daha ayrıntılı belge için [Gin kaynak kodu dokümantasyonu](https://github.com/gin-gonic/gin/blob/master/docs/doc.md) adresini incele.
