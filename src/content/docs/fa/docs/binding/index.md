---
title: "اتصال داده"
sidebar:
  order: 4
---

Gin یک سیستم اتصال قدرتمند ارائه می‌دهد که داده‌های درخواست را به structهای Go تجزیه و به طور خودکار اعتبارسنجی می‌کند. به جای فراخوانی دستی `c.PostForm()` یا خواندن `c.Request.Body`، یک struct با تگ‌ها تعریف کنید و اجازه دهید Gin کار را انجام دهد.

## Bind در مقابل ShouldBind

Gin دو خانواده از متدهای اتصال ارائه می‌دهد:

| متد | در صورت خطا | زمان استفاده |
|--------|----------|----------|
| `c.Bind`، `c.BindJSON` و غیره | به طور خودکار `c.AbortWithError(400, err)` را فراخوانی می‌کند | زمانی که می‌خواهید Gin پاسخ‌های خطا را مدیریت کند |
| `c.ShouldBind`، `c.ShouldBindJSON` و غیره | خطا را برای مدیریت شما برمی‌گرداند | زمانی که می‌خواهید پاسخ‌های خطای سفارشی داشته باشید |

در اکثر موارد، برای کنترل بیشتر بر مدیریت خطا **`ShouldBind` را ترجیح دهید**.

## مثال سریع

```go
type LoginForm struct {
  User     string `form:"user" binding:"required"`
  Password string `form:"password" binding:"required"`
}

func main() {
  router := gin.Default()

  router.POST("/login", func(c *gin.Context) {
    var form LoginForm
    // ShouldBind checks Content-Type to select a binding engine automatically
    if err := c.ShouldBind(&form); err != nil {
      c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      return
    }
    c.JSON(http.StatusOK, gin.H{"status": "logged in"})
  })

  router.Run(":8080")
}
```

## فرمت‌های پشتیبانی شده

Gin می‌تواند داده‌ها را از منابع مختلف متصل کند: **JSON**، **XML**، **YAML**، **TOML**، **داده فرم** (URL-encoded و multipart)، **رشته‌های پرس‌وجو**، **پارامترهای URI** و **هدرها**. از تگ struct مناسب (`json`، `xml`، `yaml`، `form`، `uri`، `header`) برای نگاشت فیلدها استفاده کنید. قوانین اعتبارسنجی در تگ `binding` قرار می‌گیرند و از سینتکس [go-playground/validator](https://github.com/go-playground/validator) استفاده می‌کنند.

## در این بخش

- [**اتصال و اعتبارسنجی مدل**](./binding-and-validation/) -- مفاهیم اصلی اتصال و قوانین اعتبارسنجی
- [**اعتبارسنج‌های سفارشی**](./custom-validators/) -- ثبت توابع اعتبارسنجی خود
- [**اتصال رشته پرس‌وجو یا داده ارسالی**](./bind-query-or-post/) -- اتصال از رشته‌های پرس‌وجو و بدنه فرم
- [**اتصال URI**](./bind-uri/) -- اتصال پارامترهای مسیر به structها
- [**اتصال هدر**](./bind-header/) -- اتصال هدرهای HTTP به structها
- [**مقدار پیش‌فرض**](./default-value/) -- تنظیم مقادیر بازگشتی برای فیلدهای گمشده
- [**فرمت مجموعه**](./collection-format/) -- مدیریت پارامترهای آرایه‌ای پرس‌وجو
- [**Unmarshaler سفارشی**](./custom-unmarshaler/) -- پیاده‌سازی منطق deserialization سفارشی
- [**اتصال چک‌باکس‌های HTML**](./bind-html-checkboxes/) -- مدیریت ورودی‌های فرم چک‌باکس
- [**اتصال Multipart/urlencoded**](./multipart-urlencoded-binding/) -- اتصال داده فرم multipart
- [**تگ struct سفارشی**](./custom-struct-tag/) -- استفاده از تگ‌های struct سفارشی برای نگاشت فیلدها
- [**تلاش برای اتصال بدنه به structهای مختلف**](./bind-body-into-different-structs/) -- تجزیه بدنه درخواست بیش از یک بار
