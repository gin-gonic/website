---
title: "PureJSON"
sidebar:
  order: 5
---

عادةً، يستبدل JSON أحرف HTML الخاصة بكيانات Unicode الخاصة بها، مثلاً `<` تصبح `\u003c`. إذا أردت ترميز هذه الأحرف حرفياً، يمكنك استخدام PureJSON بدلاً من ذلك.

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
