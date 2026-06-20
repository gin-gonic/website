---
title: "Log çıktısı renklendirmesini kontrol etme"
sidebar:
  order: 4
---

Varsayılan olarak, konsoldaki log çıktısı algılanan TTY'ye bağlı olarak renklendirilmelidir.

Logları asla renklendirme:

```go
func main() {
    // Disable log's color
    gin.DisableConsoleColor()

    // Creates a gin router with default middleware:
    // logger and recovery (crash-free) middleware
    router := gin.Default()

    router.GET("/ping", func(c *gin.Context) {
        c.String(200, "pong")
    })

    router.Run(":8080")
}
```

Logları her zaman renklendirme:

```go
func main() {
    // Force log's color
    gin.ForceConsoleColor()

    // Creates a gin router with default middleware:
    // logger and recovery (crash-free) middleware
    router := gin.Default()

    router.GET("/ping", func(c *gin.Context) {
        c.String(200, "pong")
    })

    router.Run(":8080")
}
```
