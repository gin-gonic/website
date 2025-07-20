---
title: "如何寫入日誌檔"
---

```go
import (
  "io"
  "os"

  "github.com/gin-gonic/gin"
)

func main() {
  // 停用主控台顏色，寫入日誌檔時不需要主控台顏色。
  gin.DisableConsoleColor()

  // 記錄到檔案。
  f, _ := os.Create("gin.log")
  gin.DefaultWriter = io.MultiWriter(f)

  // 如果您需要同時將日誌寫入檔案和主控台，請使用以下程式碼。
  // gin.DefaultWriter = io.MultiWriter(f, os.Stdout)

  router := gin.Default()
  router.GET("/ping", func(c *gin.Context) {
    c.String(200, "pong")
  })

  router.Run(":8080")
}
```
