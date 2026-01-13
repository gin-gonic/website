---
title: "سوالات متداول"
sidebar:
  order: 9
---

## سوالات عمومی

### چگونه می‌توانم بارگذاری مجدد زنده را در هنگام توسعه فعال کنم؟

از [Air](https://github.com/air-verse/air) برای بارگذاری مجدد زنده خودکار در هنگام توسعه استفاده کنید. Air فایل‌های شما را نظارت می‌کند و برنامه شما را به طور خودکار هنگام شناسایی تغییرات بازسازی/راه‌اندازی مجدد می‌کند.

**نصب:**

```sh
# نصب Air به صورت سراسری
go install github.com/air-verse/air@latest
```

**راه‌اندازی:**

یک فایل پیکربندی `.air.toml` در ریشه پروژه خود ایجاد کنید:

```sh
air init
```

این یک پیکربندی پیش‌فرض ایجاد می‌کند. می‌توانید آن را برای پروژه Gin خود سفارشی کنید:

```toml
# .air.toml
root = "."
testdata_dir = "testdata"
tmp_dir = "tmp"

[build]
  args_bin = []
  bin = "./tmp/main"
  cmd = "go build -o ./tmp/main ."
  delay = 1000
  exclude_dir = ["assets", "tmp", "vendor", "testdata"]
  exclude_file = []
  exclude_regex = ["_test.go"]
  exclude_unchanged = false
  follow_symlink = false
  full_bin = ""
  include_dir = []
  include_ext = ["go", "tpl", "tmpl", "html"]
  include_file = []
  kill_delay = "0s"
  log = "build-errors.log"
  poll = false
  poll_interval = 0
  rerun = false
  rerun_delay = 500
  send_interrupt = false
  stop_on_error = false

[color]
  app = ""
  build = "yellow"
  main = "magenta"
  runner = "green"
  watcher = "cyan"

[log]
  main_only = false
  time = false

[misc]
  clean_on_exit = false

[screen]
  clear_on_rebuild = false
  keep_scroll = true
```

**استفاده:**

به سادگی `air` را در دایرکتوری پروژه خود به جای `go run` اجرا کنید:

```sh
air
```

Air اکنون فایل‌های `.go` شما را نظارت می‌کند و برنامه Gin شما را هنگام تغییرات به طور خودکار بازسازی/راه‌اندازی مجدد می‌کند.

### چگونه CORS را در Gin مدیریت کنم؟

از middleware رسمی [gin-contrib/cors](https://github.com/gin-contrib/cors) استفاده کنید:

```go
package main

import (
  "time"

  "github.com/gin-contrib/cors"
  "github.com/gin-gonic/gin"
)

func main() {
  r := gin.Default()

  // پیکربندی پیش‌فرض CORS
  r.Use(cors.Default())

  // یا تنظیمات CORS را سفارشی کنید
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

### چگونه فایل‌های استاتیک را ارائه کنم؟

از `Static()` یا `StaticFS()` برای ارائه فایل‌های استاتیک استفاده کنید:

```go
func main() {
  r := gin.Default()

  // ارائه فایل‌ها از دایرکتوری ./assets در /assets/*
  r.Static("/assets", "./assets")

  // ارائه یک فایل
  r.StaticFile("/favicon.ico", "./resources/favicon.ico")

  // ارائه از سیستم فایل تعبیه شده (Go 1.16+)
  r.StaticFS("/public", http.FS(embedFS))

  r.Run()
}
```

برای جزئیات بیشتر [مثال ارائه فایل‌های استاتیک](../examples/serving-static-files/) را ببینید.

### چگونه آپلود فایل را مدیریت کنم؟

از `FormFile()` برای یک فایل یا `MultipartForm()` برای چند فایل استفاده کنید:

```go
// آپلود یک فایل
r.POST("/upload", func(c *gin.Context) {
  file, _ := c.FormFile("file")

  // ذخیره فایل
  c.SaveUploadedFile(file, "./uploads/"+file.Filename)

  c.String(200, "فایل %s با موفقیت آپلود شد", file.Filename)
})

// آپلود چند فایل
r.POST("/upload-multiple", func(c *gin.Context) {
  form, _ := c.MultipartForm()
  files := form.File["files"]

  for _, file := range files {
    c.SaveUploadedFile(file, "./uploads/"+file.Filename)
  }

  c.String(200, "%d فایل آپلود شد", len(files))
})
```

برای جزئیات بیشتر [مثال‌های آپلود فایل](../examples/upload-file/) را ببینید.

### چگونه احراز هویت با JWT را پیاده‌سازی کنم؟

از [gin-contrib/jwt](https://github.com/gin-contrib/jwt) استفاده کنید یا middleware سفارشی پیاده‌سازی کنید:

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

func GenerateToken(username string) (string, error) {
  claims := Claims{
    Username: username,
    RegisteredClaims: jwt.RegisteredClaims{
      ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
      IssuedAt:  jwt.NewNumericDate(time.Now()),
    },
  }

  token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
  return token.SignedString(jwtSecret)
}

func AuthMiddleware() gin.HandlerFunc {
  return func(c *gin.Context) {
    tokenString := c.GetHeader("Authorization")
    if tokenString == "" {
      c.JSON(http.StatusUnauthorized, gin.H{"error": "توکن مجوز وجود ندارد"})
      c.Abort()
      return
    }

    // حذف پیشوند "Bearer " در صورت وجود
    if len(tokenString) > 7 && tokenString[:7] == "Bearer " {
      tokenString = tokenString[7:]
    }

    token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
      return jwtSecret, nil
    })

    if err != nil || !token.Valid {
      c.JSON(http.StatusUnauthorized, gin.H{"error": "توکن نامعتبر"})
      c.Abort()
      return
    }

    if claims, ok := token.Claims.(*Claims); ok {
      c.Set("username", claims.Username)
      c.Next()
    } else {
      c.JSON(http.StatusUnauthorized, gin.H{"error": "ادعاهای توکن نامعتبر"})
      c.Abort()
    }
  }
}

func main() {
  r := gin.Default()

  r.POST("/login", func(c *gin.Context) {
    var credentials struct {
      Username string `json:"username"`
      Password string `json:"password"`
    }

    if err := c.BindJSON(&credentials); err != nil {
      c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      return
    }

    // اعتبارسنجی اعتبارنامه‌ها (منطق خود را پیاده‌سازی کنید)
    if credentials.Username == "admin" && credentials.Password == "password" {
      token, _ := GenerateToken(credentials.Username)
      c.JSON(http.StatusOK, gin.H{"token": token})
    } else {
      c.JSON(http.StatusUnauthorized, gin.H{"error": "اعتبارنامه‌های نامعتبر"})
    }
  })

  // مسیرهای محافظت شده
  authorized := r.Group("/")
  authorized.Use(AuthMiddleware())
  {
    authorized.GET("/profile", func(c *gin.Context) {
      username := c.MustGet("username").(string)
      c.JSON(http.StatusOK, gin.H{"username": username})
    })
  }

  r.Run()
}
```

### چگونه ثبت درخواست‌ها را راه‌اندازی کنم؟

Gin شامل middleware ثبت پیش‌فرض است. آن را سفارشی کنید یا از ثبت ساختاریافته استفاده کنید:

```go
package main

import (
  "log"
  "time"

  "github.com/gin-gonic/gin"
)

// middleware ثبت سفارشی
func Logger() gin.HandlerFunc {
  return func(c *gin.Context) {
    start := time.Now()
    path := c.Request.URL.Path

    c.Next()

    latency := time.Since(start)
    statusCode := c.Writer.Status()
    clientIP := c.ClientIP()
    method := c.Request.Method

    log.Printf("[GIN] %s | %3d | %13v | %15s | %-7s %s",
      time.Now().Format("2006/01/02 - 15:04:05"),
      statusCode,
      latency,
      clientIP,
      method,
      path,
    )
  }
}

func main() {
  r := gin.New()
  r.Use(Logger())
  r.Use(gin.Recovery())

  r.GET("/ping", func(c *gin.Context) {
    c.JSON(200, gin.H{"message": "pong"})
  })

  r.Run()
}
```

برای ثبت پیشرفته‌تر، [مثال فرمت ثبت سفارشی](../examples/custom-log-format/) را ببینید.

### چگونه خاموشی زیبا را مدیریت کنم؟

خاموشی زیبا را برای بستن صحیح اتصالات پیاده‌سازی کنید:

```go
package main

import (
  "context"
  "log"
  "net/http"
  "os"
  "os/signal"
  "syscall"
  "time"

  "github.com/gin-gonic/gin"
)

func main() {
  r := gin.Default()

  r.GET("/", func(c *gin.Context) {
    time.Sleep(5 * time.Second)
    c.String(http.StatusOK, "خوش آمدید!")
  })

  srv := &http.Server{
    Addr:    ":8080",
    Handler: r,
  }

  // اجرای سرور در goroutine
  go func() {
    if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
      log.Fatalf("گوش دادن: %s\n", err)
    }
  }()

  // انتظار برای سیگنال قطع برای خاموشی زیبای سرور
  quit := make(chan os.Signal, 1)
  signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
  <-quit
  log.Println("در حال خاموش کردن سرور...")

  // دادن 5 ثانیه به درخواست‌های معلق برای تکمیل
  ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
  defer cancel()

  if err := srv.Shutdown(ctx); err != nil {
    log.Fatal("سرور به اجبار خاموش شد:", err)
  }

  log.Println("سرور خارج شد")
}
```

برای جزئیات بیشتر [مثال راه‌اندازی مجدد یا توقف زیبا](../examples/graceful-restart-or-stop/) را ببینید.

### چرا به جای "405 Method Not Allowed" پاسخ "404 Not Found" دریافت می‌کنم؟

به طور پیش‌فرض، Gin برای مسیرهایی که متد HTTP درخواستی را پشتیبانی نمی‌کنند 404 برمی‌گرداند. برای برگرداندن 405 Method Not Allowed، گزینه `HandleMethodNotAllowed` را فعال کنید.

برای جزئیات [سوالات متداول Method Not Allowed](./method-not-allowed/) را ببینید.

### چگونه پارامترهای کوئری و داده‌های POST را با هم متصل کنم؟

از `ShouldBind()` استفاده کنید که به طور خودکار اتصال را بر اساس نوع محتوا انتخاب می‌کند:

```go
type User struct {
  Name  string `form:"name" json:"name"`
  Email string `form:"email" json:"email"`
  Page  int    `form:"page"`
}

r.POST("/user", func(c *gin.Context) {
  var user User
  // اتصال پارامترهای کوئری و بدنه درخواست (JSON/form)
  if err := c.ShouldBind(&user); err != nil {
    c.JSON(400, gin.H{"error": err.Error()})
    return
  }
  c.JSON(200, user)
})
```

برای کنترل بیشتر، [مثال اتصال کوئری یا POST](../examples/bind-query-or-post/) را ببینید.

### چگونه داده‌های درخواست را اعتبارسنجی کنم؟

Gin از [go-playground/validator](https://github.com/go-playground/validator) برای اعتبارسنجی استفاده می‌کند. برچسب‌های اعتبارسنجی را به ساختارهای خود اضافه کنید:

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
  c.JSON(200, gin.H{"message": "کاربر معتبر است"})
})
```

برای اعتبارسنج‌های سفارشی، [مثال اعتبارسنج‌های سفارشی](../examples/custom-validators/) را ببینید.

### چگونه Gin را در حالت تولید اجرا کنم؟

متغیر محیطی `GIN_MODE` را روی `release` تنظیم کنید:

```sh
export GIN_MODE=release
# یا
GIN_MODE=release ./your-app
```

یا به صورت برنامه‌ای تنظیم کنید:

```go
gin.SetMode(gin.ReleaseMode)
```

حالت انتشار:

- ثبت اشکال‌زدایی را غیرفعال می‌کند
- عملکرد را بهبود می‌بخشد
- اندازه باینری را کمی کاهش می‌دهد

### چگونه اتصالات پایگاه داده را با Gin مدیریت کنم؟

از تزریق وابستگی یا context برای اشتراک‌گذاری اتصالات پایگاه داده استفاده کنید:

```go
package main

import (
  "database/sql"

  "github.com/gin-gonic/gin"
  _ "github.com/lib/pq"
)

func main() {
  db, err := sql.Open("postgres", "postgres://user:pass@localhost/dbname")
  if err != nil {
    panic(err)
  }
  defer db.Close()

  r := gin.Default()

  // روش 1: پاس دادن db به handler ها
  r.GET("/users", func(c *gin.Context) {
    var users []string
    rows, _ := db.Query("SELECT name FROM users")
    defer rows.Close()

    for rows.Next() {
      var name string
      rows.Scan(&name)
      users = append(users, name)
    }

    c.JSON(200, users)
  })

  // روش 2: استفاده از middleware برای تزریق db
  r.Use(func(c *gin.Context) {
    c.Set("db", db)
    c.Next()
  })

  r.Run()
}
```

برای ORM، استفاده از [GORM](https://gorm.io/) با Gin را در نظر بگیرید.

### چگونه handler های Gin را تست کنم؟

از `net/http/httptest` برای تست مسیرهای خود استفاده کنید:

```go
package main

import (
  "net/http"
  "net/http/httptest"
  "testing"

  "github.com/gin-gonic/gin"
  "github.com/stretchr/testify/assert"
)

func SetupRouter() *gin.Engine {
  r := gin.Default()
  r.GET("/ping", func(c *gin.Context) {
    c.JSON(200, gin.H{"message": "pong"})
  })
  return r
}

func TestPingRoute(t *testing.T) {
  router := SetupRouter()

  w := httptest.NewRecorder()
  req, _ := http.NewRequest("GET", "/ping", nil)
  router.ServeHTTP(w, req)

  assert.Equal(t, 200, w.Code)
  assert.Contains(t, w.Body.String(), "pong")
}
```

برای مثال‌های بیشتر [مستندات تست](../testing/) را ببینید.

## سوالات عملکرد

### چگونه Gin را برای ترافیک بالا بهینه کنم؟

1. **از حالت انتشار استفاده کنید**: `GIN_MODE=release` را تنظیم کنید
2. **middleware غیرضروری را غیرفعال کنید**: فقط آنچه نیاز دارید استفاده کنید
3. **از `gin.New()` به جای `gin.Default()` استفاده کنید** اگر کنترل دستی middleware می‌خواهید
4. **استخر اتصال**: استخرهای اتصال پایگاه داده را به درستی پیکربندی کنید
5. **کش**: کش را برای داده‌هایی که مکرراً دسترسی می‌یابند پیاده‌سازی کنید
6. **متعادل‌سازی بار**: از پروکسی معکوس (nginx, HAProxy) استفاده کنید
7. **پروفایلینگ**: از pprof Go برای شناسایی گلوگاه‌ها استفاده کنید

```go
r := gin.New()
r.Use(gin.Recovery()) // فقط از middleware بازیابی استفاده کنید

// تنظیم محدودیت‌های استخر اتصال
db.SetMaxOpenConns(25)
db.SetMaxIdleConns(5)
db.SetConnMaxLifetime(5 * time.Minute)
```

### آیا Gin برای تولید آماده است؟

بله! Gin توسط بسیاری از شرکت‌ها در تولید استفاده می‌شود و در مقیاس آزمایش شده است. این یکی از محبوب‌ترین فریم‌ورک‌های وب Go است با:

- نگهداری فعال و جامعه
- اکوسیستم گسترده middleware
- معیارهای عملکرد عالی
- سازگاری عقب‌گرد قوی

## عیب‌یابی

### چرا پارامترهای مسیر من کار نمی‌کنند؟

مطمئن شوید که پارامترهای مسیر از نحو `:` استفاده می‌کنند و به درستی استخراج می‌شوند:

```go
// صحیح
r.GET("/user/:id", func(c *gin.Context) {
  id := c.Param("id")
  c.String(200, "شناسه کاربر: %s", id)
})

// اشتباه: /user/{id} یا /user/<id>
```

### چرا middleware من اجرا نمی‌شود؟

middleware باید قبل از مسیرها یا گروه‌های مسیر ثبت شود:

```go
// ترتیب صحیح
r := gin.New()
r.Use(MyMiddleware()) // ابتدا middleware را ثبت کنید
r.GET("/ping", handler) // سپس مسیرها

// برای گروه‌های مسیر
auth := r.Group("/admin")
auth.Use(AuthMiddleware()) // middleware برای این گروه
{
  auth.GET("/dashboard", handler)
}
```

### چرا اتصال درخواست شکست می‌خورد؟

دلایل رایج:

1. **برچسب‌های اتصال وجود ندارد**: برچسب‌های `json:"field"` یا `form:"field"` را اضافه کنید
2. **عدم تطابق Content-Type**: مطمئن شوید کلاینت هدر Content-Type صحیح را ارسال می‌کند
3. **خطاهای اعتبارسنجی**: برچسب‌ها و الزامات اعتبارسنجی را بررسی کنید
4. **فیلدهای صادر نشده**: فقط فیلدهای ساختار صادر شده (با حرف بزرگ) متصل می‌شوند

```go
type User struct {
  Name  string `json:"name" binding:"required"` // ✓ صحیح
  Email string `json:"email"`                    // ✓ صحیح
  age   int    `json:"age"`                      // ✗ متصل نخواهد شد (صادر نشده)
}
```
