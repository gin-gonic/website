---
title: "میان‌افزار مدیریت خطا"
sidebar:
  order: 4
---

در یک برنامه RESTful معمولی، ممکن است با خطاهایی در هر مسیر مواجه شوید مانند:

- ورودی نامعتبر از کاربر
- خرابی پایگاه داده
- دسترسی غیرمجاز
- باگ‌های داخلی سرور

به طور پیش‌فرض، Gin به شما اجازه می‌دهد خطاها را به صورت دستی در هر مسیر با استفاده از `c.Error(err)` مدیریت کنید.
اما این می‌تواند به سرعت تکراری و ناسازگار شود.

برای حل این مشکل، می‌توانیم از میان‌افزار سفارشی برای مدیریت تمام خطاها در یک مکان استفاده کنیم.
این میان‌افزار پس از هر درخواست اجرا می‌شود و هر خطایی که به context Gin اضافه شده (`c.Errors`) را بررسی می‌کند.
اگر خطایی پیدا کند، یک پاسخ JSON ساختاریافته با کد وضعیت مناسب ارسال می‌کند.

#### مثال

```go
import (
  "errors"
  "net/http"
  "github.com/gin-gonic/gin"
)

// ErrorHandler captures errors and returns a consistent JSON error response
func ErrorHandler() gin.HandlerFunc {
    return func(c *gin.Context) {
        c.Next() // Step1: Process the request first.

        // Step2: Check if any errors were added to the context
        if len(c.Errors) > 0 {
            // Step3: Use the last error
            err := c.Errors.Last().Err

            // Step4: Respond with a generic error message
            c.JSON(http.StatusInternalServerError, map[string]any{
                "success": false,
                "message": err.Error(),
            })
        }

        // Any other steps if no errors are found
    }
}

func main() {
    r := gin.Default()

    // Attach the error-handling middleware
    r.Use(ErrorHandler())

    r.GET("/ok", func(c *gin.Context) {
        somethingWentWrong := false

        if somethingWentWrong {
            c.Error(errors.New("something went wrong"))
            return
        }

        c.JSON(http.StatusOK, gin.H{
            "success": true,
            "message": "Everything is fine!",
        })
    })

    r.GET("/error", func(c *gin.Context) {
        somethingWentWrong := true

        if somethingWentWrong {
            c.Error(errors.New("something went wrong"))
            return
        }

        c.JSON(http.StatusOK, gin.H{
            "success": true,
            "message": "Everything is fine!",
        })
    })

    r.Run()
}

```

#### توسعه‌ها

- نگاشت خطاها به کدهای وضعیت
- تولید پاسخ‌های خطای مختلف بر اساس کدهای خطا
- لاگ‌گذاری خطاها

#### مزایای میان‌افزار مدیریت خطا

- **سازگاری**: تمام خطاها از یک فرمت پیروی می‌کنند
- **مسیرهای تمیز**: منطق کسب‌وکار از قالب‌بندی خطا جدا شده است
- **تکرار کمتر**: نیازی به تکرار منطق مدیریت خطا در هر handler نیست
