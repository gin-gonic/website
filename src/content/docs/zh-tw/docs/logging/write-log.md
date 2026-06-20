---
title: "如何寫入日誌檔案"
sidebar:
  order: 1
---

將日誌寫入檔案對於正式環境應用程式至關重要，你需要保留請求歷史記錄以供除錯、稽核或監控使用。預設情況下，Gin 將所有日誌輸出寫入 `os.Stdout`。你可以在建立路由器之前設定 `gin.DefaultWriter` 來重新導向。

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

### 同時寫入檔案和主控台

Go 標準函式庫中的 `io.MultiWriter` 函式接受多個 `io.Writer` 值，並將寫入複製到所有值。這在開發過程中很有用，你想在終端機中查看日誌的同時也將它們持久化到磁碟：

```go
f, _ := os.Create("gin.log")
gin.DefaultWriter = io.MultiWriter(f, os.Stdout)
```

使用此設定，每個日誌條目都會同時寫入 `gin.log` 和主控台。

### 正式環境中的日誌輪替

上面的範例使用 `os.Create`，每次應用程式啟動時都會截斷日誌檔案。在正式環境中，你通常想要追加到現有日誌並根據大小或時間輪替檔案。考慮使用日誌輪替函式庫，如 [lumberjack](https://github.com/natefinch/lumberjack)：

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

### 另請參閱

- [自訂日誌格式](../custom-log-format/) -- 定義自訂的日誌格式。
- [控制日誌輸出著色](../controlling-log-output-coloring/) -- 停用或強制彩色輸出。
- [跳過日誌記錄](../skip-logging/) -- 排除特定路由不被記錄。
