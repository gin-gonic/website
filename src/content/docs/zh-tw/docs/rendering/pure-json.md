---
title: "PureJSON"
sidebar:
  order: 5
---

通常，JSON 會將特殊 HTML 字元替換為它們的 Unicode 實體，例如 `<` 會變成 `\u003c`。如果你想要原樣編碼這些字元，可以改用 PureJSON。

```go
package main

import (
  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  // Serves unicode entities
  router.GET("/json", func(c *gin.Context) {
    c.JSON(200, gin.H{
      "html": "<b>Hello, world!</b>",
    })
  })

  // Serves literal characters
  router.GET("/purejson", func(c *gin.Context) {
    c.PureJSON(200, gin.H{
      "html": "<b>Hello, world!</b>",
    })
  })

  // Abort early with a PureJSON response and status code (v1.11+)
  router.GET("/abort_purejson", func(c *gin.Context) {
    c.AbortWithStatusPureJSON(403, gin.H{"error": "forbidden"})
  })

  // listen and serve on 0.0.0.0:8080
  router.Run(":8080")
}
```
