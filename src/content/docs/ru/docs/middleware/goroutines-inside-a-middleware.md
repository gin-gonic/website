---
title: "Горутины внутри middleware"
sidebar:
  order: 6
---

При запуске новых горутин внутри middleware или обработчика вы **НЕ ДОЛЖНЫ** использовать оригинальный контекст внутри них, необходимо использовать копию только для чтения.

### Почему `c.Copy()` необходим

Gin использует **sync.Pool** для повторного использования объектов `gin.Context` между запросами ради производительности. После возврата обработчика `gin.Context` возвращается в пул и может быть назначен совершенно другому запросу. Если горутина всё ещё содержит ссылку на оригинальный контекст в этот момент, она будет читать или записывать поля, которые теперь принадлежат другому запросу. Это приводит к **состояниям гонки**, **повреждению данных** или **паникам**.

Вызов `c.Copy()` создаёт снимок контекста, который безопасно использовать после возврата обработчика. Копия включает запрос, URL, ключи и другие данные только для чтения, но отделена от жизненного цикла пула.

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
