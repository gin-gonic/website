---
title: "سوالات متداول"
sidebar:
  order: 15
---

## سوالات عمومی

### چگونه بارگذاری مجدد خودکار را در حین توسعه فعال کنم؟

از [Air](https://github.com/air-verse/air) برای بارگذاری مجدد خودکار در حین توسعه استفاده کنید. Air فایل‌های شما را نظارت می‌کند و هنگام تشخیص تغییرات، برنامه شما را بازسازی/راه‌اندازی مجدد می‌کند.

**نصب:**

```sh
go install github.com/air-verse/air@latest
```

**راه‌اندازی:**

یک فایل پیکربندی `.air.toml` در ریشه پروژه خود ایجاد کنید:

```sh
air init
```

سپس `air` را در پوشه پروژه خود به جای `go run` اجرا کنید:

```sh
air
```

Air فایل‌های `.go` شما را نظارت کرده و به طور خودکار برنامه Gin شما را هنگام تغییرات بازسازی/راه‌اندازی مجدد می‌کند. برای گزینه‌های پیکربندی [مستندات Air](https://github.com/air-verse/air) را ببینید.

### چگونه CORS را در Gin مدیریت کنم؟

از میان‌افزار رسمی [gin-contrib/cors](https://github.com/gin-contrib/cors) استفاده کنید:

```go
package main

import (
  "time"

  "github.com/gin-contrib/cors"
  "github.com/gin-gonic/gin"
)

func main() {
  r := gin.Default()

  // Default CORS configuration
  r.Use(cors.Default())

  // Or customize CORS settings
  r.Use(cors.New(cors.Config{
    AllowOrigins:     []string{"https://example.com"},
    AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
    AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
    ExposeHeaders:    []string{"Content-Length"},
    AllowCredentials: true,
    MaxAge:           12 * time.Hour,
  }))

  r.GET("/ping", func(c *gin.Context) {
    c.JSON(200, gin.H{"message": "pong"})
  })

  r.Run()
}
```

برای مرور کامل امنیتی، [بهترین روش‌های امنیتی](/fa/docs/middleware/security-guide/) را ببینید.

### چگونه فایل‌های استاتیک را ارائه دهم؟

از `Static()` یا `StaticFS()` برای ارائه فایل‌های استاتیک استفاده کنید:

```go
func main() {
  r := gin.Default()

  // Serve files from ./assets directory at /assets/*
  r.Static("/assets", "./assets")

  // Serve a single file
  r.StaticFile("/favicon.ico", "./resources/favicon.ico")

  // Serve from embedded filesystem (Go 1.16+)
  r.StaticFS("/public", http.FS(embedFS))

  r.Run()
}
```

برای جزئیات بیشتر [ارائه داده از فایل](/fa/docs/rendering/serving-data-from-file/) را ببینید.

### چگونه آپلود فایل را مدیریت کنم؟

از `FormFile()` برای فایل‌های تکی یا `MultipartForm()` برای فایل‌های متعدد استفاده کنید:

```go
// Single file upload
r.POST("/upload", func(c *gin.Context) {
  file, _ := c.FormFile("file")
  c.SaveUploadedFile(file, "./uploads/"+file.Filename)
  c.String(200, "File %s uploaded successfully", file.Filename)
})

// Multiple files upload
r.POST("/upload-multiple", func(c *gin.Context) {
  form, _ := c.MultipartForm()
  files := form.File["files"]

  for _, file := range files {
    c.SaveUploadedFile(file, "./uploads/"+file.Filename)
  }
  c.String(200, "%d files uploaded", len(files))
})
```

برای جزئیات بیشتر مستندات [آپلود فایل](/fa/docs/routing/upload-file/) را ببینید.

### چگونه احراز هویت JWT را پیاده‌سازی کنم؟

از [gin-contrib/jwt](https://github.com/gin-contrib/jwt) استفاده کنید یا میان‌افزار سفارشی پیاده‌سازی کنید. در اینجا یک مثال ساده آمده است:

```go
package main

import (
  "net/http"
  "time"

  "github.com/gin-gonic/gin"
  "github.com/golang-jwt/jwt/v5"
)

var jwtSecret = []byte("your-secret-key")

type Claims struct {
  Username string `json:"username"`
  jwt.RegisteredClaims
}

func AuthMiddleware() gin.HandlerFunc {
  return func(c *gin.Context) {
    tokenString := c.GetHeader("Authorization")
    if tokenString == "" {
      c.JSON(http.StatusUnauthorized, gin.H{"error": "Missing authorization token"})
      c.Abort()
      return
    }

    // Remove "Bearer " prefix if present
    if len(tokenString) > 7 && tokenString[:7] == "Bearer " {
      tokenString = tokenString[7:]
    }

    token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
      return jwtSecret, nil
    })

    if err != nil || !token.Valid {
      c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
      c.Abort()
      return
    }

    if claims, ok := token.Claims.(*Claims); ok {
      c.Set("username", claims.Username)
      c.Next()
    }
  }
}
```

برای احراز هویت مبتنی بر نشست، [مدیریت نشست](/fa/docs/middleware/session-management/) را ببینید.

### چگونه لاگ‌گذاری درخواست‌ها را تنظیم کنم؟

Gin شامل یک میان‌افزار لاگر پیش‌فرض از طریق `gin.Default()` است. برای لاگ‌گذاری ساختاریافته JSON در تولید، [لاگ‌گذاری ساختاریافته](/fa/docs/logging/structured-logging/) را ببینید.

برای سفارشی‌سازی لاگ پایه:

```go
r := gin.New()
r.Use(gin.LoggerWithConfig(gin.LoggerConfig{
  SkipPaths: []string{"/healthz"},
}))
r.Use(gin.Recovery())
```

بخش [لاگ‌گذاری](/fa/docs/logging/) را برای تمام گزینه‌ها شامل فرمت‌های سفارشی، خروجی فایل و رد شدن از رشته‌های پرس‌وجو ببینید.

### چگونه خاموشی آرام را مدیریت کنم؟

[راه‌اندازی مجدد یا توقف آرام](/fa/docs/server-config/graceful-restart-or-stop/) را برای راهنمای کامل با مثال‌های کد ببینید.

### چرا به جای "405 Method Not Allowed" پیام "404 Not Found" دریافت می‌کنم؟

به طور پیش‌فرض، Gin برای مسیرهایی که از متد HTTP درخواستی پشتیبانی نمی‌کنند 404 برمی‌گرداند. `HandleMethodNotAllowed = true` را تنظیم کنید تا به جای آن 405 برگرداند:

```go
r := gin.Default()
r.HandleMethodNotAllowed = true

r.GET("/ping", func(c *gin.Context) {
  c.JSON(200, gin.H{"message": "pong"})
})

r.Run()
```

```sh
$ curl -X POST localhost:8080/ping

HTTP/1.1 405 Method Not Allowed
Allow: GET
```

### چگونه پارامترهای پرس‌وجو و داده‌های POST را با هم متصل کنم؟

از `ShouldBind()` استفاده کنید که به طور خودکار اتصال را بر اساس نوع محتوا انتخاب می‌کند:

```go
type User struct {
  Name  string `form:"name" json:"name"`
  Email string `form:"email" json:"email"`
  Page  int    `form:"page"`
}

r.POST("/user", func(c *gin.Context) {
  var user User
  if err := c.ShouldBind(&user); err != nil {
    c.JSON(400, gin.H{"error": err.Error()})
    return
  }
  c.JSON(200, user)
})
```

بخش [اتصال داده](/fa/docs/binding/) را برای تمام گزینه‌های اتصال ببینید.

### چگونه داده‌های درخواست را اعتبارسنجی کنم؟

Gin از [go-playground/validator](https://github.com/go-playground/validator) برای اعتبارسنجی استفاده می‌کند. تگ‌های اعتبارسنجی را به structهای خود اضافه کنید:

```go
type User struct {
  Name  string `json:"name" binding:"required,min=3,max=50"`
  Email string `json:"email" binding:"required,email"`
  Age   int    `json:"age" binding:"gte=0,lte=130"`
}

r.POST("/user", func(c *gin.Context) {
  var user User
  if err := c.ShouldBindJSON(&user); err != nil {
    c.JSON(400, gin.H{"error": err.Error()})
    return
  }
  c.JSON(200, gin.H{"message": "User is valid"})
})
```

[اتصال و اعتبارسنجی](/fa/docs/binding/binding-and-validation/) را برای اعتبارسنج‌های سفارشی و استفاده پیشرفته ببینید.

### چگونه Gin را در حالت تولید اجرا کنم؟

متغیر محیطی `GIN_MODE` را به `release` تنظیم کنید:

```sh
export GIN_MODE=release
# or
GIN_MODE=release ./your-app
```

یا به صورت برنامه‌ای تنظیم کنید:

```go
gin.SetMode(gin.ReleaseMode)
```

حالت release لاگ‌گذاری اشکال‌زدایی را غیرفعال کرده و عملکرد را بهبود می‌بخشد.

### چگونه اتصالات پایگاه داده را با Gin مدیریت کنم؟

[یکپارچه‌سازی پایگاه داده](/fa/docs/server-config/database/) را برای راهنمای کامل شامل `database/sql`، GORM، connection pooling و الگوهای تزریق وابستگی ببینید.

### چگونه handlerهای Gin را تست کنم؟

از `net/http/httptest` برای تست مسیرهای خود استفاده کنید:

```go
func TestPingRoute(t *testing.T) {
  router := gin.Default()
  router.GET("/ping", func(c *gin.Context) {
    c.JSON(200, gin.H{"message": "pong"})
  })

  w := httptest.NewRecorder()
  req, _ := http.NewRequest("GET", "/ping", nil)
  router.ServeHTTP(w, req)

  assert.Equal(t, 200, w.Code)
  assert.Contains(t, w.Body.String(), "pong")
}
```

مستندات [تست](/fa/docs/testing/) را برای مثال‌های بیشتر ببینید.

## سوالات عملکرد

### چگونه Gin را برای ترافیک بالا بهینه کنم؟

1. **از حالت Release استفاده کنید**: `GIN_MODE=release` را تنظیم کنید
2. **میان‌افزارهای غیرضروری را غیرفعال کنید**: فقط از آنچه نیاز دارید استفاده کنید
3. **از `gin.New()` به جای `gin.Default()`** برای کنترل دستی میان‌افزار استفاده کنید
4. **Connection pooling**: pool اتصالات پایگاه داده را پیکربندی کنید (ببینید [یکپارچه‌سازی پایگاه داده](/fa/docs/server-config/database/))
5. **کش‌گذاری**: کش‌گذاری را برای داده‌هایی که مکرراً دسترسی می‌شوند پیاده‌سازی کنید
6. **توزیع بار**: از پروکسی معکوس (nginx، HAProxy) استفاده کنید
7. **پروفایلینگ**: از pprof در Go برای شناسایی گلوگاه‌ها استفاده کنید
8. **نظارت**: [متریک‌ها و نظارت](/fa/docs/server-config/metrics/) را برای ردیابی عملکرد تنظیم کنید

### آیا Gin آماده تولید است؟

بله. Gin توسط بسیاری از شرکت‌ها در تولید استفاده می‌شود و در مقیاس آزموده شده است. [کاربران](/fa/docs/users/) را برای مثال‌هایی از پروژه‌هایی که Gin را در تولید استفاده می‌کنند ببینید.

## عیب‌یابی

### چرا پارامترهای مسیر من کار نمی‌کنند؟

مطمئن شوید پارامترهای مسیر از سینتکس `:` استفاده می‌کنند و به درستی استخراج می‌شوند:

```go
// Correct
r.GET("/user/:id", func(c *gin.Context) {
  id := c.Param("id")
  c.String(200, "User ID: %s", id)
})

// Not: /user/{id} or /user/<id>
```

برای جزئیات [پارامترها در مسیر](/fa/docs/routing/param-in-path/) را ببینید.

### چرا میان‌افزار من اجرا نمی‌شود؟

میان‌افزار باید قبل از مسیرها یا گروه‌های مسیر ثبت شود:

```go
// Correct order
r := gin.New()
r.Use(MyMiddleware()) // Register middleware first
r.GET("/ping", handler) // Then routes

// For route groups
auth := r.Group("/admin")
auth.Use(AuthMiddleware()) // Middleware for this group
{
  auth.GET("/dashboard", handler)
}
```

برای جزئیات [استفاده از میان‌افزار](/fa/docs/middleware/using-middleware/) را ببینید.

### چرا اتصال درخواست ناموفق است؟

دلایل رایج:

1. **تگ‌های اتصال گمشده**: تگ‌های `json:"field"` یا `form:"field"` اضافه کنید
2. **عدم تطابق Content-Type**: مطمئن شوید کلاینت هدر Content-Type صحیح ارسال می‌کند
3. **خطاهای اعتبارسنجی**: تگ‌های اعتبارسنجی و الزامات را بررسی کنید
4. **فیلدهای unexported**: فقط فیلدهای struct با حرف بزرگ (exported) متصل می‌شوند

```go
type User struct {
  Name  string `json:"name" binding:"required"` // ✓ Correct
  Email string `json:"email"`                    // ✓ Correct
  age   int    `json:"age"`                      // ✗ Won't bind (unexported)
}
```

برای جزئیات [اتصال و اعتبارسنجی](/fa/docs/binding/binding-and-validation/) را ببینید.
