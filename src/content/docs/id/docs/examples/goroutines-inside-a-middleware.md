---
title: "Goroutine dalam middleware"
---

Saat memulai Goroutine baru di dalam sebuah middleware atau handler, Anda **TIDAK BOLEH** menggunakan context asli di dalamnya, Anda harus menggunakan salinan hanya-baca.

```go
func main() {
  router := gin.Default()

  router.GET("/long_async", func(c *gin.Context) {
    // buat salinan untuk digunakan di dalam goroutine
    cCp := c.Copy()
    go func() {
      // simulasikan tugas yang panjang dengan time.Sleep(). 5 detik
      time.Sleep(5 * time.Second)

      // perhatikan bahwa Anda menggunakan konteks yang disalin "cCp", INI PENTING
      log.Println("Done! in path " + cCp.Request.URL.Path)
    }()
  })

  router.GET("/long_sync", func(c *gin.Context) {
    // simulasikan tugas yang panjang dengan time.Sleep(). 5 detik
    time.Sleep(5 * time.Second)

    // selama kita TIDAK menggunakan goroutine, kita tidak perlu menyalin context
    log.Println("Done! in path " + c.Request.URL.Path)
  })

  // Jalankan server pada 0.0.0.0:8080
  router.Run(":8080")
}
```
