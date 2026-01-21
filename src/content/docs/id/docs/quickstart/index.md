---
title: "Quickstart"
sidebar:
  order: 2
---

Pada quickstart ini, kita akan mendapatkan pengetahuan dari beberapa contoh kode dan belajar caranya:

## Persyaratan

- **Versi Go**: Gin memerlukan [Go](https://go.dev/) versi [1.24](https://go.dev/doc/devel/release#go1.24) atau lebih tinggi

## Instalasi

Untuk menginstal paket Gin, Anda perlu menginstal Go dan mengatur workspace Go Anda terlebih dahulu.
Jika Anda belum memiliki file go.mod, buat dengan `go mod init gin`.

1. Unduh dan instal:

```sh
go get -u github.com/gin-gonic/gin
```

2. Impor di dalam kode Anda:

```go
import "github.com/gin-gonic/gin"
```

3. (Opsional) Impor `net/http`. Ini diperlukan, misalnya jika menggunakan konstanta seperti `http.StatusOK`.

```go
import "net/http"
```

4. Buat folder proyek Anda dan masuk ke dalamnya dengan `cd`

```sh
mkdir -p project && cd "$_"
```

5. Salin template awal ke dalam proyek Anda

```sh
curl https://raw.githubusercontent.com/gin-gonic/examples/master/basic/main.go > main.go
```

6. Jalankan proyek Anda

```sh
go run main.go
```

## Memulai

> Tidak tahu cara menulis dan menjalankan kode Go? [Klik di sini](https://golang.org/doc/code.html).

Pertama, buat file `example.go`:

```sh
# asumsikan kode berikut ada di dalam file example.go
$ touch example.go
```

Selanjutnya, masukkan kode berikut ke dalam `example.go`:

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
  router.Run() // jalankan server pada 0.0.0.0:8080
}
```

Dan, Anda dapat menjalankan kode melalui `go run example.go`:

```sh
# jalankan example.go dan kunjungi 0.0.0.0:8080/ping di browser
$ go run example.go
```

Jika Anda lebih memilih untuk menggunakan paket `net/http`, ikuti contoh kode di bawah ini

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

  router.Run() // jalankan server pada 0.0.0.0:8080
}
```

---

## Tips & Sumber Daya

- Baru mengenal Go? Pelajari cara menulis dan menjalankan kode Go [di sini](https://golang.org/doc/code.html).
- Ingin berlatih konsep Gin secara langsung? Lihat [Sumber Belajar](../learning-resources) kami untuk tantangan interaktif dan tutorial.
- Informasi tambahan tersedia di [repositori kode sumber Gin](https://github.com/gin-gonic/gin/blob/master/docs/doc.md).
