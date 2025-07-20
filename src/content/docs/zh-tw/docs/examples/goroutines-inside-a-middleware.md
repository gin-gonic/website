---
title: "在中介軟體中使用 Goroutine"
---

在中介軟體或處理函式中啟動新的 Goroutine 時，您**不應**在其中使用原始的上下文，而必須使用唯讀的副本。

```go
import (
	"log"
	"time"

	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()

	router.GET("/long_async", func(c *gin.Context) {
		// 建立一個在 goroutine 中使用的副本
		cCp := c.Copy()
		go func() {
			// 模擬一個耗時 5 秒的長時間任務
			time.Sleep(5 * time.Second)

			// 請注意，您使用的是複製的上下文 "cCp"，這點很重要
			log.Println("完成！路徑為 " + cCp.Request.URL.Path)
		}()
	})

	router.GET("/long_sync", func(c *gin.Context) {
		// 模擬一個耗時 5 秒的長時間任務
		time.Sleep(5 * time.Second)

		// 因為我們沒有使用 goroutine，所以不需要複製上下文
		log.Println("完成！路徑為 " + c.Request.URL.Path)
	})

	// 在 0.0.0.0:8080 上監聽並提供服務
	router.Run(":8080")
}
```
