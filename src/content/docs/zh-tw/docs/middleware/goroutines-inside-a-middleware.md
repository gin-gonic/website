---
title: "在中介軟體中使用 Goroutine"
sidebar:
  order: 6
---

在中介軟體或處理函式中啟動新的 Goroutine 時，**不應該**在其中使用原始的上下文，你必須使用唯讀副本。

### 為什麼 `c.Copy()` 至關重要

Gin 使用 **sync.Pool** 來重複利用 `gin.Context` 物件以提升效能。一旦處理函式返回，`gin.Context` 就會被歸還到池中，並可能被分配給完全不同的請求。如果 Goroutine 在那個時候仍然持有對原始上下文的參照，它會讀取或寫入現在屬於另一個請求的欄位。這會導致**競態條件**、**資料損壞**或 **panic**。

呼叫 `c.Copy()` 會建立一個上下文的快照，在處理函式返回後仍可安全使用。副本包含請求、URL、鍵和其他唯讀資料，但與池的生命週期分離。

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
