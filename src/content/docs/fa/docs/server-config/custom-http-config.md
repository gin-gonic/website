---
title: "پیکربندی HTTP سفارشی"
sidebar:
  order: 1
---

به‌طور پیش‌فرض، `router.Run()` یک سرور HTTP ساده راه‌اندازی می‌کند. برای استفاده در محیط production، ممکن است نیاز به سفارشی‌سازی timeout‌ها، محدودیت‌های هدر، یا تنظیمات TLS داشته باشید. می‌توانید این کار را با ایجاد `http.Server` خودتان و ارسال روتر Gin به‌عنوان `Handler` انجام دهید.

## استفاده پایه

روتر Gin را مستقیماً به `http.ListenAndServe` ارسال کنید:

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.GET("/ping", func(c *gin.Context) {
    c.String(http.StatusOK, "pong")
  })

  http.ListenAndServe(":8080", router)
}
```

## با تنظیمات سفارشی سرور

یک struct `http.Server` ایجاد کنید تا timeout‌های خواندن/نوشتن و گزینه‌های دیگر را پیکربندی کنید:

```go
package main

import (
  "net/http"
  "time"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.GET("/ping", func(c *gin.Context) {
    c.String(http.StatusOK, "pong")
  })

  s := &http.Server{
    Addr:           ":8080",
    Handler:        router,
    ReadTimeout:    10 * time.Second,
    WriteTimeout:   10 * time.Second,
    MaxHeaderBytes: 1 << 20,
  }
  s.ListenAndServe()
}
```

## تست

```sh
curl http://localhost:8080/ping
# Output: pong
```

## همچنین ببینید

- [راه‌اندازی مجدد یا توقف مهربانانه](/fa/docs/server-config/graceful-restart-or-stop/)
- [اجرای سرویس‌های متعدد](/fa/docs/server-config/run-multiple-service/)
