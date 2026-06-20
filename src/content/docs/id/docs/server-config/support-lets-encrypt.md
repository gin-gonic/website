---
title: "Dukungan Let's Encrypt"
sidebar:
  order: 3
---

Paket [gin-gonic/autotls](https://github.com/gin-gonic/autotls) menyediakan HTTPS otomatis melalui Let's Encrypt. Paket ini menangani penerbitan dan pembaruan sertifikat secara otomatis, sehingga Anda dapat menyajikan HTTPS dengan konfigurasi minimal.

## Mulai cepat

Cara paling sederhana adalah memanggil `autotls.Run` dengan router Anda dan satu atau lebih nama domain:

```go
package main

import (
  "log"

  "github.com/gin-gonic/autotls"
  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.GET("/ping", func(c *gin.Context) {
    c.String(200, "pong")
  })

  log.Fatal(autotls.Run(router, "example1.com", "example2.com"))
}
```

## Manajer autocert kustom

Untuk kontrol lebih — seperti menentukan direktori cache sertifikat atau membatasi hostname yang diizinkan — gunakan `autotls.RunWithManager` dengan `autocert.Manager` kustom:

```go
package main

import (
  "log"

  "github.com/gin-gonic/autotls"
  "github.com/gin-gonic/gin"
  "golang.org/x/crypto/acme/autocert"
)

func main() {
  router := gin.Default()

  router.GET("/ping", func(c *gin.Context) {
    c.String(200, "pong")
  })

  m := autocert.Manager{
    Prompt:     autocert.AcceptTOS,
    HostPolicy: autocert.HostWhitelist("example1.com", "example2.com"),
    Cache:      autocert.DirCache("/var/www/.cache"),
  }

  log.Fatal(autotls.RunWithManager(router, &m))
}
```

:::note
Let's Encrypt mengharuskan server Anda dapat diakses pada port 80 dan 443 dari internet publik. Ini tidak akan berfungsi di localhost atau di belakang firewall yang memblokir koneksi masuk.
:::

## Lihat juga

- [Konfigurasi HTTP kustom](/id/docs/server-config/custom-http-config/)
