---
title: "How to write log file"
sidebar:
  order: 1
---

Writing logs to a file is essential for production applications where you need to retain request history for debugging, auditing, or monitoring. By default, Gin writes all log output to `os.Stdout`. You can redirect this by setting `gin.DefaultWriter` before creating the router.

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

### Writing to both file and console

The `io.MultiWriter` function from Go's standard library accepts multiple `io.Writer` values and duplicates writes to all of them. This is useful during development when you want to see logs in the terminal while also persisting them to disk:

```go
f, _ := os.Create("gin.log")
gin.DefaultWriter = io.MultiWriter(f, os.Stdout)
```

With this setup, every log entry is written to both `gin.log` and the console simultaneously.

### Log rotation in production

The example above uses `os.Create`, which truncates the log file each time the application starts. In production, you typically want to append to existing logs and rotate files based on size or time. Consider using a log rotation library such as [lumberjack](https://github.com/natefinch/lumberjack):

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

### See also

- [Custom log format](../custom-log-format/) -- Define your own log line format.
- [Controlling log output coloring](../controlling-log-output-coloring/) -- Disable or force colored output.
- [Skip logging](../skip-logging/) -- Exclude specific routes from being logged.
