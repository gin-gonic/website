---
title: "綁定標頭"
sidebar:
  order: 9
---

`ShouldBindHeader` 使用 `header` 結構體標籤將 HTTP 請求標頭直接綁定到結構體。這對於從傳入請求中提取 API 速率限制、驗證權杖或自訂網域標頭等中繼資料非常有用。

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

type testHeader struct {
  Rate   int    `header:"Rate"`
  Domain string `header:"Domain"`
}

func main() {
  r := gin.Default()

  r.GET("/", func(c *gin.Context) {
    h := testHeader{}

    if err := c.ShouldBindHeader(&h); err != nil {
      c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      return
    }

    c.JSON(http.StatusOK, gin.H{"Rate": h.Rate, "Domain": h.Domain})
  })

  r.Run(":8080")
}
```

## 測試

```sh
# Pass custom headers
curl -H "Rate:300" -H "Domain:music" http://localhost:8080/
# Output: {"Domain":"music","Rate":300}

# Missing headers -- zero values are used
curl http://localhost:8080/
# Output: {"Domain":"","Rate":0}
```

:::note
根據 HTTP 規範，標頭名稱不區分大小寫。`header` 結構體標籤的值是以不區分大小寫的方式進行比對，因此 `header:"Rate"` 會匹配以 `Rate`、`rate` 或 `RATE` 傳送的標頭。
:::

:::tip
你可以將 `header` 標籤與 `binding:"required"` 結合使用，以拒絕缺少必要標頭的請求：

```go
type authHeader struct {
  Token string `header:"Authorization" binding:"required"`
}
```

:::

## 另請參閱

- [綁定與驗證](/zh-tw/docs/binding/binding-and-validation/)
- [綁定查詢字串或 POST 資料](/zh-tw/docs/binding/bind-query-or-post/)
