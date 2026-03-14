---
title: "PureJSON"
sidebar:
  order: 5
---

通常、JSONは特殊なHTML文字をUnicodeエンティティに置換します。例えば`<`は`\u003c`になります。このような文字をそのままエンコードしたい場合は、代わりにPureJSONを使用できます。

```go
package main

import (
  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  // Unicodeエンティティを配信
  router.GET("/json", func(c *gin.Context) {
    c.JSON(200, gin.H{
      "html": "<b>Hello, world!</b>",
    })
  })

  // リテラル文字を配信
  router.GET("/purejson", func(c *gin.Context) {
    c.PureJSON(200, gin.H{
      "html": "<b>Hello, world!</b>",
    })
  })

  // PureJSONレスポンスとステータスコードで早期に中断（v1.11以降）
  router.GET("/abort_purejson", func(c *gin.Context) {
    c.AbortWithStatusPureJSON(403, gin.H{"error": "forbidden"})
  })

  // 0.0.0.0:8080でリッスンしてサーブ
  router.Run(":8080")
}
```
