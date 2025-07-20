---
title: "PureJSON"
---

一般來說，JSON 會將特殊的 HTML 字元取代為其 Unicode 實體，例如 `<` 會變成 `\u003c`。如果您想直接編碼這些字元，可以使用 PureJSON。
此功能在 Go 1.6 及更早版本中不可用。

```go
import "github.com/gin-gonic/gin"

func main() {
  router := gin.Default()

  // 提供 Unicode 實體
  router.GET("/json", func(c *gin.Context) {
    c.JSON(200, gin.H{
      "html": "<b>哈囉，世界！</b>",
    })
  })

  // 提供字面字元
  router.GET("/purejson", func(c *gin.Context) {
    c.PureJSON(200, gin.H{
      "html": "<b>哈囉，世界！</b>",
    })
  })

  // 在 0.0.0.0:8080 上監聽並提供服務
  router.Run(":8080")
}
```
