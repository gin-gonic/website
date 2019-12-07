---
title: "ログ出力の色付けを制御する"
draft: false
---

デフォルトでは、ログ出力は検出された TTY に応じて色付けされます。

ログの色付けを止めるには:

```go
func main() {
    // ログの色付けを無効にする:
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

常にログの色付けをするには:

```go
func main() {
    // ログの色付けを常に有効にする:
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
