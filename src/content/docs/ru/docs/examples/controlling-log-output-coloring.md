---
title: "Управление раскраской вывода журнала"

---

По умолчанию логи, выводимые на консоль, должны быть окрашены в зависимости от обнаруженного TTY.

Никогда не окрашивать журналы: 

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

Всегда окрашивайте журналы в разные цвета:

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
