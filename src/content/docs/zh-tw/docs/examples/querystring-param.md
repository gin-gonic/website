---
title: "查詢字串參數"
---

```go
import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  // 查詢字串參數是使用現有的底層請求物件來解析的。
  // 請求會回應符合以下格式的 URL： /welcome?firstname=Jane&lastname=Doe
  router.GET("/welcome", func(c *gin.Context) {
    firstname := c.DefaultQuery("firstname", "Guest")
    lastname := c.Query("lastname") // c.Request.URL.Query().Get("lastname") 的簡寫

    c.String(http.StatusOK, "哈囉 %s %s", firstname, lastname)
  })
  router.Run(":8080")
}
```
