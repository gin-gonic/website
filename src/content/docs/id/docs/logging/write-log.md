---
title: "Cara menulis file log"
sidebar:
  order: 1
---

Menulis log ke file sangat penting untuk aplikasi produksi di mana Anda perlu menyimpan riwayat permintaan untuk debugging, audit, atau pemantauan. Secara default, Gin menulis semua output log ke `os.Stdout`. Anda dapat mengarahkan ini dengan mengatur `gin.DefaultWriter` sebelum membuat router.

```go
package main

import (
  "io"
  "os"

  "github.com/gin-gonic/gin"
)

func main() {
    // Disable Console Color, you don't need console color when writing the logs to file.
    gin.DisableConsoleColor()

    // Logging to a file.
    f, _ := os.Create("gin.log")
    gin.DefaultWriter = io.MultiWriter(f)

    // Use the following code if you need to write the logs to file and console at the same time.
    // gin.DefaultWriter = io.MultiWriter(f, os.Stdout)

    router := gin.Default()
    router.GET("/ping", func(c *gin.Context) {
        c.String(200, "pong")
    })

    router.Run(":8080")
}
```

### Menulis ke file dan konsol

Fungsi `io.MultiWriter` dari pustaka standar Go menerima beberapa nilai `io.Writer` dan menduplikasi penulisan ke semuanya. Ini berguna selama pengembangan ketika Anda ingin melihat log di terminal sambil juga menyimpannya ke disk:

```go
f, _ := os.Create("gin.log")
gin.DefaultWriter = io.MultiWriter(f, os.Stdout)
```

Dengan pengaturan ini, setiap entri log ditulis ke `gin.log` dan konsol secara bersamaan.

### Rotasi log di produksi

Contoh di atas menggunakan `os.Create`, yang memotong file log setiap kali aplikasi dimulai. Di produksi, Anda biasanya ingin menambahkan ke log yang ada dan merotasi file berdasarkan ukuran atau waktu. Pertimbangkan menggunakan pustaka rotasi log seperti [lumberjack](https://github.com/natefinch/lumberjack):

```go
import "gopkg.in/natefinch/lumberjack.v2"

func main() {
    gin.DisableConsoleColor()

    gin.DefaultWriter = &lumberjack.Logger{
        Filename:   "gin.log",
        MaxSize:    100, // megabytes
        MaxBackups: 3,
        MaxAge:     28, // days
    }

    router := gin.Default()
    router.GET("/ping", func(c *gin.Context) {
        c.String(200, "pong")
    })

    router.Run(":8080")
}
```

### Lihat juga

- [Format log kustom](../custom-log-format/) -- Mendefinisikan format baris log Anda sendiri.
- [Mengontrol pewarnaan output log](../controlling-log-output-coloring/) -- Menonaktifkan atau memaksa output berwarna.
- [Melewati logging](../skip-logging/) -- Mengecualikan rute tertentu dari pencatatan log.
