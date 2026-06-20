---
title: "مدیریت نشست"
sidebar:
  order: 9
---

نشست‌ها به شما اجازه می‌دهند داده‌های خاص کاربر را در چندین درخواست HTTP ذخیره کنید. از آنجا که HTTP بدون حالت است، نشست‌ها از کوکی‌ها یا مکانیزم‌های دیگر برای شناسایی کاربران بازگشتی و بازیابی داده‌های ذخیره شده آن‌ها استفاده می‌کنند.

## استفاده از gin-contrib/sessions

میان‌افزار [gin-contrib/sessions](https://github.com/gin-contrib/sessions) مدیریت نشست با پشتیبان‌های ذخیره‌سازی متعدد ارائه می‌دهد:

```sh
go get github.com/gin-contrib/sessions
```

### نشست‌های مبتنی بر کوکی

ساده‌ترین رویکرد داده‌های نشست را در کوکی‌های رمزنگاری شده ذخیره می‌کند:

```go
package main

import (
  "net/http"

  "github.com/gin-contrib/sessions"
  "github.com/gin-contrib/sessions/cookie"
  "github.com/gin-gonic/gin"
)

func main() {
  r := gin.Default()

  // Create cookie-based session store with a secret key
  store := cookie.NewStore([]byte("your-secret-key"))
  r.Use(sessions.Sessions("mysession", store))

  r.GET("/login", func(c *gin.Context) {
    session := sessions.Default(c)
    session.Set("user", "john")
    session.Save()
    c.JSON(http.StatusOK, gin.H{"message": "logged in"})
  })

  r.GET("/profile", func(c *gin.Context) {
    session := sessions.Default(c)
    user := session.Get("user")
    if user == nil {
      c.JSON(http.StatusUnauthorized, gin.H{"error": "not logged in"})
      return
    }
    c.JSON(http.StatusOK, gin.H{"user": user})
  })

  r.GET("/logout", func(c *gin.Context) {
    session := sessions.Default(c)
    session.Clear()
    session.Save()
    c.JSON(http.StatusOK, gin.H{"message": "logged out"})
  })

  r.Run(":8080")
}
```

### نشست‌های مبتنی بر Redis

برای برنامه‌های تولیدی، نشست‌ها را در Redis برای مقیاس‌پذیری در چندین نمونه ذخیره کنید:

```go
package main

import (
  "net/http"

  "github.com/gin-contrib/sessions"
  "github.com/gin-contrib/sessions/redis"
  "github.com/gin-gonic/gin"
)

func main() {
  r := gin.Default()

  // Connect to Redis for session storage
  store, err := redis.NewStore(10, "tcp", "localhost:6379", "", []byte("secret"))
  if err != nil {
    panic(err)
  }
  r.Use(sessions.Sessions("mysession", store))

  r.GET("/set", func(c *gin.Context) {
    session := sessions.Default(c)
    session.Set("count", 1)
    session.Save()
    c.JSON(http.StatusOK, gin.H{"count": 1})
  })

  r.GET("/get", func(c *gin.Context) {
    session := sessions.Default(c)
    count := session.Get("count")
    c.JSON(http.StatusOK, gin.H{"count": count})
  })

  r.Run(":8080")
}
```

## گزینه‌های نشست

رفتار نشست را با `sessions.Options` پیکربندی کنید:

```go
session := sessions.Default(c)
session.Options(sessions.Options{
  Path:     "/",
  MaxAge:   3600,        // Session expires in 1 hour (seconds)
  HttpOnly: true,        // Prevent JavaScript access
  Secure:   true,        // Only send over HTTPS
  SameSite: http.SameSiteLaxMode,
})
```

| گزینه | توضیحات |
|--------|-------------|
| `Path` | محدوده مسیر کوکی (پیش‌فرض: `/`) |
| `MaxAge` | طول عمر به ثانیه. از `-1` برای حذف، `0` برای نشست مرورگر استفاده کنید |
| `HttpOnly` | دسترسی JavaScript به کوکی را ممنوع می‌کند |
| `Secure` | فقط کوکی را از طریق HTTPS ارسال می‌کند |
| `SameSite` | رفتار کوکی بین‌سایتی را کنترل می‌کند (`Lax`، `Strict`، `None`) |

:::note
همیشه در تولید `HttpOnly: true` و `Secure: true` را تنظیم کنید تا کوکی‌های نشست را از حملات XSS و man-in-the-middle محافظت کنید.
:::

## پشتیبان‌های موجود

| پشتیبان | پکیج | مورد استفاده |
|---------|---------|----------|
| Cookie | `sessions/cookie` | برنامه‌های ساده، داده‌های نشست کم |
| Redis | `sessions/redis` | تولید، استقرارهای چند نمونه‌ای |
| Memcached | `sessions/memcached` | لایه کش با عملکرد بالا |
| MongoDB | `sessions/mongo` | وقتی MongoDB ذخیره‌سازی اصلی شماست |
| PostgreSQL | `sessions/postgres` | وقتی PostgreSQL ذخیره‌سازی اصلی شماست |

## نشست‌ها در مقابل JWT

| جنبه | نشست‌ها | JWT |
|--------|----------|-----|
| ذخیره‌سازی | سمت سرور (Redis، DB) | سمت کلاینت (توکن) |
| لغو | آسان (حذف از store) | دشوار (نیاز به لیست سیاه) |
| مقیاس‌پذیری | نیاز به store مشترک | بدون حالت |
| حجم داده | نامحدود سمت سرور | محدود به حجم توکن |

از نشست‌ها زمانی استفاده کنید که نیاز به لغو آسان دارید (مثلاً خروج، مسدود کردن کاربر). از JWT زمانی استفاده کنید که نیاز به احراز هویت بدون حالت در میکروسرویس‌ها دارید.

## همچنین ببینید

- [مدیریت کوکی](/en/docs/server-config/cookie/)
- [بهترین روش‌های امنیتی](/en/docs/middleware/security-guide/)
- [استفاده از میان‌افزار](/en/docs/middleware/using-middleware/)
