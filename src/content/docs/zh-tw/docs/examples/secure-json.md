---
title: "SecureJSON"
---

使用 SecureJSON 來防止 JSON 劫持。如果給定的結構是陣列值，預設會在回應主體前加上 `"while(1),"。

```go
import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  // 您也可以使用自己的安全 JSON 前置詞
  // router.SecureJsonPrefix(")]}',\n")

  router.GET("/someJSON", func(c *gin.Context) {
    names := []string{"lena", "austin", "foo"}

    // 將輸出：   while(1);["lena","austin","foo"]
    c.SecureJSON(http.StatusOK, names)
  })

  // 在 0.0.0.0:8080 上監聽並提供服務
  router.Run(":8080")
}
```
