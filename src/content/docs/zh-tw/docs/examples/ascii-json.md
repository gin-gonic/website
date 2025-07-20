---
title: "AsciiJSON"
---

使用 AsciiJSON 來產生僅含 ASCII 字元並逸出非 ASCII 字元的 JSON。

```go
import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.GET("/someJSON", func(c *gin.Context) {
    data := map[string]interface{}{
      "lang": "GO語言",
      "tag":  "<br>",
    }

    // 將輸出：{"lang":"GO\u8bed\u8a00","tag":"\u003cbr\u003e"}
    c.AsciiJSON(http.StatusOK, data)
  })

  // 監聽並在 0.0.0.0:8080 上提供服務
  router.Run(":8080")
}
```
