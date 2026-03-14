---
title: "헤더 바인딩"
sidebar:
  order: 9
---

`ShouldBindHeader`를 사용하여 HTTP 요청 헤더를 구조체에 바인딩합니다.

```go
package main

import (
  "fmt"
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
      c.JSON(http.StatusOK, err)
    }

    fmt.Printf("%#v\n", h)
    c.JSON(http.StatusOK, gin.H{"Rate": h.Rate, "Domain": h.Domain})
  })

  r.Run()

// 클라이언트
// curl -H "rate:300" -H "domain:music" 127.0.0.1:8080/
// 출력
// {"Domain":"music","Rate":300}
}
```
