---
title: "Cara menulis file log"
---

```go
func main() {
    // Nonaktifkan Warna Konsol, Anda tidak memerlukan warna konsol saat menulis log ke file.
    gin.DisableConsoleColor()

    // Mencatat log ke file.
    f, _ := os.Create("gin.log")
    gin.DefaultWriter = io.MultiWriter(f)

    // Gunakan kode berikut jika Anda perlu menulis log ke file dan konsol secara bersamaan.
    // gin.DefaultWriter = io.MultiWriter(f, os.Stdout)

    router := gin.Default()
    router.GET("/ping", func(c *gin.Context) {
        c.String(200, "pong")
    })

    router.Run(":8080")
}
```
