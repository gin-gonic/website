---
title: "کنترل رنگ‌آمیزی خروجی لاگ"
sidebar:
  order: 4
---

به طور پیش‌فرض، خروجی لاگ در کنسول بسته به TTY تشخیص داده شده باید رنگی باشد.

هرگز لاگ‌ها را رنگی نکنید:

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

همیشه لاگ‌ها را رنگی کنید:

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
