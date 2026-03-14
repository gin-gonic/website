---
title: "PureJSON"
sidebar:
  order: 5
---

일반적으로 JSON은 특수 HTML 문자를 유니코드 엔티티로 대체합니다. 예를 들어 `<`는 `\u003c`가 됩니다. 이러한 문자를 그대로 인코딩하려면 PureJSON을 대신 사용할 수 있습니다.

```go
package main

import (
  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  // 유니코드 엔티티를 서빙
  router.GET("/json", func(c *gin.Context) {
    c.JSON(200, gin.H{
      "html": "<b>Hello, world!</b>",
    })
  })

  // 리터럴 문자를 서빙
  router.GET("/purejson", func(c *gin.Context) {
    c.PureJSON(200, gin.H{
      "html": "<b>Hello, world!</b>",
    })
  })

  // PureJSON 응답과 상태 코드로 조기 중단 (v1.11+)
  router.GET("/abort_purejson", func(c *gin.Context) {
    c.AbortWithStatusPureJSON(403, gin.H{"error": "forbidden"})
  })

  // 0.0.0.0:8080에서 수신 대기 및 서비스
  router.Run(":8080")
}
```
