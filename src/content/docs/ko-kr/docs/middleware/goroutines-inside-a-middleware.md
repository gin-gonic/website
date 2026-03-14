---
title: "미들웨어 내 고루틴"
sidebar:
  order: 6
---

미들웨어나 핸들러 내에서 새로운 고루틴을 시작할 때, 그 안에서 원래 컨텍스트를 사용**해서는 안 됩니다**. 반드시 읽기 전용 복사본을 사용해야 합니다.

### `c.Copy()`가 필수적인 이유

Gin은 성능을 위해 **sync.Pool**을 사용하여 요청 간에 `gin.Context` 객체를 재사용합니다. 핸들러가 반환되면 `gin.Context`는 풀에 반환되고 완전히 다른 요청에 할당될 수 있습니다. 그 시점에 고루틴이 여전히 원래 컨텍스트에 대한 참조를 보유하고 있다면, 이제 다른 요청에 속하는 필드를 읽거나 쓰게 됩니다. 이는 **레이스 컨디션**, **데이터 손상** 또는 **패닉**으로 이어집니다.

`c.Copy()`를 호출하면 핸들러가 반환된 후에도 안전하게 사용할 수 있는 컨텍스트의 스냅샷이 생성됩니다. 복사본에는 요청, URL, 키 및 기타 읽기 전용 데이터가 포함되지만, 풀 라이프사이클에서 분리됩니다.

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
    // 고루틴 내에서 사용할 복사본 생성
    cCp := c.Copy()
    go func() {
      // time.Sleep()으로 긴 작업 시뮬레이션. 5초
      time.Sleep(5 * time.Second)

      // 복사된 컨텍스트 "cCp"를 사용하고 있다는 점에 주의, 중요
      log.Println("Done! in path " + cCp.Request.URL.Path)
    }()
  })

  router.GET("/long_sync", func(c *gin.Context) {
    // time.Sleep()으로 긴 작업 시뮬레이션. 5초
    time.Sleep(5 * time.Second)

    // 고루틴을 사용하지 않으므로 컨텍스트를 복사할 필요가 없습니다
    log.Println("Done! in path " + c.Request.URL.Path)
  })

  // 0.0.0.0:8080에서 수신 대기 및 서비스
  router.Run(":8080")
}
```
