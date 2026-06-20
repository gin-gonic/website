---
title: "中间件中的 Goroutine"
sidebar:
  order: 6
---

在中间件或处理函数中启动新的 Goroutine 时，**不应该**在其中使用原始上下文，必须使用只读副本。

### 为什么 `c.Copy()` 至关重要

Gin 使用 **sync.Pool** 来复用 `gin.Context` 对象以提高性能。一旦处理函数返回，`gin.Context` 就会被返回到池中，可能会被分配给一个完全不同的请求。如果此时一个 goroutine 仍然持有对原始上下文的引用，它将读取或写入现在属于另一个请求的字段。这会导致**竞态条件**、**数据损坏**或 **panic**。

调用 `c.Copy()` 会创建一个上下文快照，可以在处理函数返回后安全使用。副本包含请求、URL、键和其他只读数据，但与池的生命周期分离。

```go
package main

import (
  "log"
  "time"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.GET("/long_async", func(c *gin.Context) {
    // create copy to be used inside the goroutine
    cCp := c.Copy()
    go func() {
      // simulate a long task with time.Sleep(). 5 seconds
      time.Sleep(5 * time.Second)

      // note that you are using the copied context "cCp", IMPORTANT
      log.Println("Done! in path " + cCp.Request.URL.Path)
    }()
  })

  router.GET("/long_sync", func(c *gin.Context) {
    // simulate a long task with time.Sleep(). 5 seconds
    time.Sleep(5 * time.Second)

    // since we are NOT using a goroutine, we do not have to copy the context
    log.Println("Done! in path " + c.Request.URL.Path)
  })

  // Listen and serve on 0.0.0.0:8080
  router.Run(":8080")
}
```
