---
title: "اجرای سرویس‌های متعدد"
sidebar:
  order: 4
---

می‌توانید چندین سرور Gin را در یک پروسه -- هر کدام روی پورت متفاوت -- با استفاده از `errgroup.Group` از پکیج `golang.org/x/sync/errgroup` اجرا کنید. این زمانی مفید است که نیاز به ارائه APIهای جداگانه دارید (مثلاً یک API عمومی روی پورت 8080 و یک API مدیریت روی پورت 8081) بدون نیاز به استقرار باینری‌های جداگانه.

هر سرور روتر، پشته میان‌افزار، و پیکربندی `http.Server` مخصوص به خود را دارد.

```go
package main

import (
  "log"
  "net/http"
  "time"

  "github.com/gin-gonic/gin"
  "golang.org/x/sync/errgroup"
)

var (
  g errgroup.Group
)

func router01() http.Handler {
  e := gin.New()
  e.Use(gin.Recovery())
  e.GET("/", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{
      "code":    http.StatusOK,
      "message": "Welcome server 01",
    })
  })

  return e
}

func router02() http.Handler {
  e := gin.New()
  e.Use(gin.Recovery())
  e.GET("/", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{
      "code":    http.StatusOK,
      "message": "Welcome server 02",
    })
  })

  return e
}

func main() {
  server01 := &http.Server{
    Addr:         ":8080",
    Handler:      router01(),
    ReadTimeout:  5 * time.Second,
    WriteTimeout: 10 * time.Second,
  }

  server02 := &http.Server{
    Addr:         ":8081",
    Handler:      router02(),
    ReadTimeout:  5 * time.Second,
    WriteTimeout: 10 * time.Second,
  }

  g.Go(func() error {
    return server01.ListenAndServe()
  })

  g.Go(func() error {
    return server02.ListenAndServe()
  })

  if err := g.Wait(); err != nil {
    log.Fatal(err)
  }
}
```

## تست

```sh
# Server 01 on port 8080
curl http://localhost:8080/
# Output: {"code":200,"message":"Welcome server 01"}

# Server 02 on port 8081
curl http://localhost:8081/
# Output: {"code":200,"message":"Welcome server 02"}
```

:::note
اگر هر یک از سرورها نتواند شروع به کار کند (مثلاً اگر پورت قبلاً در حال استفاده باشد)، `g.Wait()` اولین خطا را برمی‌گرداند. هر دو سرور باید با موفقیت شروع به کار کنند تا پروسه ادامه پیدا کند.
:::

## همچنین ببینید

- [پیکربندی HTTP سفارشی](/fa/docs/server-config/custom-http-config/)
- [راه‌اندازی مجدد یا توقف مهربانانه](/fa/docs/server-config/graceful-restart-or-stop/)
