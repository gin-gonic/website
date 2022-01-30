---
title: "Hızlı Başlangıç"
draft: false
weight: 2
---

Bu hızlı başlangıçta, kod parçacıklarından içgörüler toplayacağız ve aşağıda belirtilen adımları nasıl yapacağımızı öğreneceğiz:

## Gereksinimler

- Go 1.13 veya üzeri

## Kurulum

Gin paketini kurmak için önce Go'yu kurmanız ve Go çalışma alanınızı ayarlamanız gerekir.

1. İndirin ve kurun:

```sh
$ go get -u github.com/gin-gonic/gin
```

2. Kodunuzda import edin:

```go
import "github.com/gin-gonic/gin"
```

3. (İsteğe bağlı) `net/http` paketini import edin. Bu, `http.StatusOK` gibi statü belirten ifadeler kullanılıyorsa gereklidir. 

```go
import "net/http"
```

1. Proje klasörünüzü oluşturun ve `cd` komutu ile içine girin

```sh
$ mkdir -p $GOPATH/src/github.com/myusername/project && cd "$_"
```

2. Projenizin içine bir başlangıç ​​şablonu kopyalayın

```sh
$ curl https://raw.githubusercontent.com/gin-gonic/examples/master/basic/main.go > main.go
```

3. Projenizi çalıştırın

```sh
$ go run main.go
```

## Başlarken
> Go kodunu nasıl yazıp çalıştıracağınızdan emin değil misiniz? [Buraya tıklayın](https://golang.org/doc/code.html).

İlk olarak, `example.go` adlı bir dosya oluşturun

```sh
# aşağıdaki kodları example.go dosyasında varsayalım
$ touch example.go
```

Ardından, aşağıdaki kodu `example.go` dosyasının içine yerleştirin

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
	r.Run() // 0.0.0.0:8080 adresini dinleyin ve servis edin
}
```

Ve, kodu şu şekilde çalıştırabilirsiniz : `go run example.go`:

```sh
# example.go dosyasını çalıştırın ve tarayıcıda 0.0.0.0:8080/ping adresini ziyaret edin
$ go run example.go
```
