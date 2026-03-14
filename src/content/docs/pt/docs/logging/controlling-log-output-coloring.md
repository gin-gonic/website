---
title: "Controlando coloração da saída de log"
sidebar:
  order: 4
---

Por padrão, a saída de logs no console deve ser colorizada dependendo do TTY detectado.

Nunca colorizar logs:

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

Sempre colorizar logs:

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
