---
title: "میان‌افزار مدیریت خطا"
sidebar:
  order: 4
---

در یک برنامه RESTful معمولی، ممکن است در هر مسیر با خطاهایی مواجه شوید -- ورودی نامعتبر، خرابی پایگاه داده، دسترسی غیرمجاز، یا باگ‌های داخلی. مدیریت جداگانه خطاها در هر handler منجر به کد تکراری و پاسخ‌های ناسازگار می‌شود.

یک میان‌افزار متمرکز مدیریت خطا این مشکل را با اجرا پس از هر درخواست و بررسی خطاهای اضافه‌شده به context Gin از طریق `c.Error(err)` حل می‌کند. اگر خطایی یافت شود، یک پاسخ JSON ساختاریافته با کد وضعیت مناسب ارسال می‌کند.

```go
package main

import (
  "errors"
  "net/http"

  "github.com/gin-gonic/gin"
)

// ErrorHandler captures errors and returns a consistent JSON error response
func ErrorHandler() gin.HandlerFunc {
  return func(c *gin.Context) {
    c.Next() // Process the request first

    // Check if any errors were added to the context
    if len(c.Errors) > 0 {
      err := c.Errors.Last().Err

      c.JSON(http.StatusInternalServerError, gin.H{
        "success": false,
        "message": err.Error(),
      })
    }
  }
}

func main() {
  r := gin.Default()

  // Attach the error-handling middleware
  r.Use(ErrorHandler())

  r.GET("/ok", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{
      "success": true,
      "message": "Everything is fine!",
    })
  })

  r.GET("/error", func(c *gin.Context) {
    c.Error(errors.New("something went wrong"))
  })

  r.Run(":8080")
}
```

## تست

```sh
# Successful request
curl http://localhost:8080/ok
# Output: {"message":"Everything is fine!","success":true}

# Error request -- middleware catches the error
curl http://localhost:8080/error
# Output: {"message":"something went wrong","success":false}
```

:::tip
می‌توانید این الگو را گسترش دهید تا انواع خطاهای خاص را به کدهای وضعیت HTTP مختلف نگاشت کنید، یا قبل از پاسخ دادن خطاها را به یک سرویس خارجی لاگ کنید.
:::

## همچنین ببینید

- [میان‌افزار سفارشی](/fa/docs/middleware/custom-middleware/)
- [استفاده از میان‌افزار](/fa/docs/middleware/using-middleware/)
