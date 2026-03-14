---
title: "إدارة الجلسات"
sidebar:
  order: 9
---

تسمح لك الجلسات بتخزين بيانات خاصة بالمستخدم عبر طلبات HTTP متعددة. بما أن HTTP عديم الحالة، تستخدم الجلسات ملفات تعريف الارتباط أو آليات أخرى لتحديد المستخدمين العائدين واسترجاع بياناتهم المخزنة.

## استخدام gin-contrib/sessions

يوفر وسيط [gin-contrib/sessions](https://github.com/gin-contrib/sessions) إدارة الجلسات مع واجهات تخزين متعددة:

```sh
go get github.com/gin-contrib/sessions
```

### الجلسات المبنية على ملفات تعريف الارتباط

أبسط نهج يخزن بيانات الجلسة في ملفات تعريف ارتباط مشفرة:

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

### الجلسات المبنية على Redis

لتطبيقات الإنتاج، خزّن الجلسات في Redis لقابلية التوسع عبر نسخ متعددة:

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

## خيارات الجلسة

كوّن سلوك الجلسة باستخدام `sessions.Options`:

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

| الخيار | الوصف |
|--------|-------------|
| `Path` | نطاق مسار ملف تعريف الارتباط (الافتراضي: `/`) |
| `MaxAge` | العمر بالثواني. استخدم `-1` للحذف، `0` لجلسة المتصفح |
| `HttpOnly` | يمنع وصول JavaScript إلى ملف تعريف الارتباط |
| `Secure` | يُرسل ملف تعريف الارتباط فقط عبر HTTPS |
| `SameSite` | يتحكم في سلوك ملف تعريف الارتباط عبر المواقع (`Lax`، `Strict`، `None`) |

:::note
عيّن دائماً `HttpOnly: true` و`Secure: true` في بيئة الإنتاج لحماية ملفات تعريف ارتباط الجلسة من هجمات XSS ورجل المنتصف.
:::

## الواجهات الخلفية المتاحة

| الواجهة الخلفية | الحزمة | حالة الاستخدام |
|---------|---------|----------|
| Cookie | `sessions/cookie` | تطبيقات بسيطة، بيانات جلسة صغيرة |
| Redis | `sessions/redis` | الإنتاج، النشر متعدد النسخ |
| Memcached | `sessions/memcached` | طبقة تخزين مؤقت عالية الأداء |
| MongoDB | `sessions/mongo` | عندما يكون MongoDB مخزن بياناتك الأساسي |
| PostgreSQL | `sessions/postgres` | عندما يكون PostgreSQL مخزن بياناتك الأساسي |

## الجلسات مقابل JWT

| الجانب | الجلسات | JWT |
|--------|----------|-----|
| التخزين | جانب الخادم (Redis، قاعدة بيانات) | جانب العميل (رمز) |
| الإلغاء | سهل (الحذف من المخزن) | صعب (يتطلب قائمة حظر) |
| قابلية التوسع | يحتاج مخزناً مشتركاً | عديم الحالة |
| حجم البيانات | غير محدود على جانب الخادم | محدود بحجم الرمز |

استخدم الجلسات عندما تحتاج إلغاءً سهلاً (مثل تسجيل الخروج، حظر المستخدم). استخدم JWT عندما تحتاج مصادقة عديمة الحالة عبر الخدمات المصغّرة.

## انظر أيضاً

- [معالجة ملفات تعريف الارتباط](/ar/docs/server-config/cookie/)
- [أفضل ممارسات الأمان](/ar/docs/middleware/security-guide/)
- [استخدام الوسيطات](/ar/docs/middleware/using-middleware/)
