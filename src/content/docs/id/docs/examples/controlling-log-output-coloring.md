---
title: "Mengontrol pewarnaan keluaran Log"
---

Secara bawaan, keluaran log di konsol seharusnya diwarnai berdasarkan TTY yang terdeteksi.

Menonaktifkan pewarnaan log:

```go
func main() {
    // Nonaktifkan warna log
    gin.DisableConsoleColor()
    
    // Membuat router gin dengan middleware bawaan:
    // logger dan recovery (bebas crash) middleware
    router := gin.Default()
    
    router.GET("/ping", func(c *gin.Context) {
        c.String(200, "pong")
    })
    
    router.Run(":8080")
}
```

Selalu warnai log:

```go
func main() {
    // Paksa warna log
    gin.ForceConsoleColor()
    
    // Membuat router gin dengan middleware bawaan:
    // logger dan recovery (bebas crash) middleware
    router := gin.Default()
    
    router.GET("/ping", func(c *gin.Context) {
        c.String(200, "pong")
    })
    
    router.Run(":8080")
}
```
