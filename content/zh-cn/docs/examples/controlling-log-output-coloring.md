---
title: "控制日志输出颜色"
draft: false
---

根据检测到的 TTY，控制台的日志输出默认是有颜色的。

禁止日志颜色化:

```go
func main() {
    // 禁止日志的颜色
    gin.DisableConsoleColor()

    // 用默认中间件创建一个 gin 路由:
    // 日志和恢复（无崩溃）中间件
    router := gin.Default()

    router.GET("/ping", func(c *gin.Context) {
        c.String(200, "pong")
    })

    router.Run(":8080")
}
```

日志颜色化:

```go
func main() {
    // 强制日志颜色化
    gin.ForceConsoleColor()

    // 用默认中间件创建一个 gin 路由:
    // 日志和恢复（无崩溃）中间件
    router := gin.Default()

    router.GET("/ping", func(c *gin.Context) {
        c.String(200, "pong")
    })

    router.Run(":8080")
}
```

