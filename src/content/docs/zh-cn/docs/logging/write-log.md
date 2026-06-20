---
title: "如何写入日志文件"
sidebar:
  order: 1
---

将日志写入文件对于生产应用至关重要，你需要保留请求历史记录以用于调试、审计或监控。默认情况下，Gin 将所有日志输出写入 `os.Stdout`。你可以在创建路由器之前通过设置 `gin.DefaultWriter` 来重定向。

```go
package main

import (
  "io"
  "os"

  "github.com/gin-gonic/gin"
)

func main() {
    // Disable Console Color, you don't need console color when writing the logs to file.
    gin.DisableConsoleColor()

    // Logging to a file.
    f, _ := os.Create("gin.log")
    gin.DefaultWriter = io.MultiWriter(f)

    // Use the following code if you need to write the logs to file and console at the same time.
    // gin.DefaultWriter = io.MultiWriter(f, os.Stdout)

    router := gin.Default()
    router.GET("/ping", func(c *gin.Context) {
        c.String(200, "pong")
    })

    router.Run(":8080")
}
```

### 同时写入文件和控制台

Go 标准库中的 `io.MultiWriter` 函数接受多个 `io.Writer` 值，并将写入复制到所有目标。这在开发时很有用，你既想在终端看到日志，又想将其持久化到磁盘：

```go
f, _ := os.Create("gin.log")
gin.DefaultWriter = io.MultiWriter(f, os.Stdout)
```

使用此设置，每条日志记录都会同时写入 `gin.log` 和控制台。

### 生产环境中的日志轮转

上面的示例使用 `os.Create`，每次应用启动时都会截断日志文件。在生产环境中，你通常希望追加到现有日志并根据大小或时间轮转文件。考虑使用日志轮转库如 [lumberjack](https://github.com/natefinch/lumberjack)：

```go
import "gopkg.in/natefinch/lumberjack.v2"

func main() {
    gin.DisableConsoleColor()

    gin.DefaultWriter = &lumberjack.Logger{
        Filename:   "gin.log",
        MaxSize:    100, // megabytes
        MaxBackups: 3,
        MaxAge:     28, // days
    }

    router := gin.Default()
    router.GET("/ping", func(c *gin.Context) {
        c.String(200, "pong")
    })

    router.Run(":8080")
}
```

### 另请参阅

- [自定义日志格式](../custom-log-format/) -- 定义自己的日志行格式。
- [控制日志输出着色](../controlling-log-output-coloring/) -- 禁用或强制彩色输出。
- [跳过日志记录](../skip-logging/) -- 排除特定路由的日志记录。
