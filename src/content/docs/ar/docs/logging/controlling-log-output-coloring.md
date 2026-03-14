---
title: "التحكم في تلوين مخرجات السجل"
sidebar:
  order: 4
---

افتراضياً، يجب تلوين مخرجات السجل على وحدة التحكم اعتماداً على اكتشاف TTY.

عدم تلوين السجلات أبداً:

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

تلوين السجلات دائماً:

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
