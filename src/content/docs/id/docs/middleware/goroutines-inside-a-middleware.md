---
title: "Goroutine di dalam middleware"
sidebar:
  order: 6
---

Saat memulai Goroutine baru di dalam middleware atau handler, Anda **TIDAK BOLEH** menggunakan context asli di dalamnya, Anda harus menggunakan salinan read-only.

### Mengapa `c.Copy()` penting

Gin menggunakan **sync.Pool** untuk menggunakan kembali objek `gin.Context` antar permintaan demi performa. Setelah handler selesai, `gin.Context` dikembalikan ke pool dan mungkin ditetapkan ke permintaan yang sama sekali berbeda. Jika goroutine masih memegang referensi ke context asli pada saat itu, ia akan membaca atau menulis field yang sekarang milik permintaan lain. Ini menyebabkan **race condition**, **kerusakan data**, atau **panic**.

Memanggil `c.Copy()` membuat snapshot dari context yang aman digunakan setelah handler selesai. Salinan mencakup request, URL, keys, dan data read-only lainnya, tetapi terlepas dari siklus hidup pool.

```go
package main

import (
  "log"
  "time"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.GET("/long_async", func(c *gin.Context) {
    // create copy to be used inside the goroutine
    cCp := c.Copy()
    go func() {
      // simulate a long task with time.Sleep(). 5 seconds
      time.Sleep(5 * time.Second)

      // note that you are using the copied context "cCp", IMPORTANT
      log.Println("Done! in path " + cCp.Request.URL.Path)
    }()
  })

  router.GET("/long_sync", func(c *gin.Context) {
    // simulate a long task with time.Sleep(). 5 seconds
    time.Sleep(5 * time.Second)

    // since we are NOT using a goroutine, we do not have to copy the context
    log.Println("Done! in path " + c.Request.URL.Path)
  })

  // Listen and serve on 0.0.0.0:8080
  router.Run(":8080")
}
```
