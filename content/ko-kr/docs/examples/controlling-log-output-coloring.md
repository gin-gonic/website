---
title: "Controlling Log output coloring"
draft: false
---

By default, logs output on console should be colorized depending on the detected TTY.

Never colorize logs: 

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

Always colorize logs: 

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
