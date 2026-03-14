---
title: "PureJSON"
sidebar:
  order: 5
---

Normalnya, JSON mengganti karakter HTML khusus dengan entitas unicode-nya, mis. `<` menjadi `\u003c`. Jika Anda ingin mengenkode karakter tersebut secara literal, Anda dapat menggunakan PureJSON sebagai gantinya.

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
