---
title: "الأسئلة الشائعة"
sidebar:
  order: 9
---

## أسئلة عامة

### كيف يمكنني تفعيل إعادة التحميل المباشر أثناء التطوير؟

استخدم [Air](https://github.com/cosmtrek/air) لإعادة التحميل المباشر التلقائي أثناء التطوير. يراقب Air ملفاتك ويعيد بناء/إعادة تشغيل تطبيقك تلقائياً عند اكتشاف التغييرات.

**التثبيت:**

```sh
# تثبيت Air عالمياً
go install github.com/cosmtrek/air@latest
```

**الإعداد:**

أنشئ ملف تكوين `.air.toml` في جذر مشروعك:

```sh
air init
```

هذا ينشئ تكويناً افتراضياً. يمكنك تخصيصه لمشروع Gin الخاص بك:

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

**الاستخدام:**

ببساطة قم بتشغيل `air` في دليل مشروعك بدلاً من `go run`:

```sh
air
```

سيراقب Air الآن ملفات `.go` الخاصة بك ويعيد بناء/إعادة تشغيل تطبيق Gin تلقائياً عند التغييرات.

### كيف أتعامل مع CORS في Gin؟

استخدم الـ middleware الرسمي [gin-contrib/cors](https://github.com/gin-contrib/cors):

```go
package main

import (
  "time"

  "github.com/gin-contrib/cors"
  "github.com/gin-gonic/gin"
)

func main() {
  r := gin.Default()

  // تكوين CORS الافتراضي
  r.Use(cors.Default())

  // أو خصص إعدادات CORS
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

### كيف أقدم الملفات الثابتة؟

استخدم `Static()` أو `StaticFS()` لتقديم الملفات الثابتة:

```go
func main() {
  r := gin.Default()

  // تقديم الملفات من دليل ./assets في /assets/*
  r.Static("/assets", "./assets")

  // تقديم ملف واحد
  r.StaticFile("/favicon.ico", "./resources/favicon.ico")

  // تقديم من نظام ملفات مضمن (Go 1.16+)
  r.StaticFS("/public", http.FS(embedFS))

  r.Run()
}
```

راجع [مثال تقديم الملفات الثابتة](../examples/serving-static-files/) لمزيد من التفاصيل.

### كيف أتعامل مع رفع الملفات؟

استخدم `FormFile()` لملف واحد أو `MultipartForm()` لملفات متعددة:

```go
// رفع ملف واحد
r.POST("/upload", func(c *gin.Context) {
  file, _ := c.FormFile("file")

  // حفظ الملف
  c.SaveUploadedFile(file, "./uploads/"+file.Filename)

  c.String(200, "تم رفع الملف %s بنجاح", file.Filename)
})

// رفع ملفات متعددة
r.POST("/upload-multiple", func(c *gin.Context) {
  form, _ := c.MultipartForm()
  files := form.File["files"]

  for _, file := range files {
    c.SaveUploadedFile(file, "./uploads/"+file.Filename)
  }

  c.String(200, "تم رفع %d ملفات", len(files))
})
```

راجع [أمثلة رفع الملفات](../examples/upload-file/) لمزيد من التفاصيل.

### كيف أنفذ المصادقة باستخدام JWT؟

استخدم [gin-contrib/jwt](https://github.com/gin-contrib/jwt) أو نفذ middleware مخصص:

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
      c.JSON(http.StatusUnauthorized, gin.H{"error": "رمز التفويض مفقود"})
      c.Abort()
      return
    }

    // إزالة البادئة "Bearer " إن وجدت
    if len(tokenString) > 7 && tokenString[:7] == "Bearer " {
      tokenString = tokenString[7:]
    }

    token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
      return jwtSecret, nil
    })

    if err != nil || !token.Valid {
      c.JSON(http.StatusUnauthorized, gin.H{"error": "رمز غير صالح"})
      c.Abort()
      return
    }

    if claims, ok := token.Claims.(*Claims); ok {
      c.Set("username", claims.Username)
      c.Next()
    } else {
      c.JSON(http.StatusUnauthorized, gin.H{"error": "مطالبات الرمز غير صالحة"})
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

    // التحقق من بيانات الاعتماد (نفذ منطقك الخاص)
    if credentials.Username == "admin" && credentials.Password == "password" {
      token, _ := GenerateToken(credentials.Username)
      c.JSON(http.StatusOK, gin.H{"token": token})
    } else {
      c.JSON(http.StatusUnauthorized, gin.H{"error": "بيانات اعتماد غير صالحة"})
    }
  })

  // المسارات المحمية
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

### كيف أعد تسجيل الطلبات؟

يتضمن Gin middleware تسجيل افتراضي. خصصه أو استخدم التسجيل المنظم:

```go
package main

import (
  "log"
  "time"

  "github.com/gin-gonic/gin"
)

// middleware تسجيل مخصص
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

للتسجيل المتقدم، راجع [مثال تنسيق السجل المخصص](../examples/custom-log-format/).

### كيف أتعامل مع الإغلاق الرشيق؟

نفذ الإغلاق الرشيق لإغلاق الاتصالات بشكل صحيح:

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
    c.String(http.StatusOK, "مرحباً!")
  })

  srv := &http.Server{
    Addr:    ":8080",
    Handler: r,
  }

  // تشغيل الخادم في goroutine
  go func() {
    if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
      log.Fatalf("الاستماع: %s\n", err)
    }
  }()

  // انتظار إشارة المقاطعة لإغلاق الخادم بشكل رشيق
  quit := make(chan os.Signal, 1)
  signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
  <-quit
  log.Println("جاري إغلاق الخادم...")

  // إعطاء الطلبات المعلقة 5 ثواني للإكمال
  ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
  defer cancel()

  if err := srv.Shutdown(ctx); err != nil {
    log.Fatal("إغلاق الخادم قسرياً:", err)
  }

  log.Println("انتهى الخادم")
}
```

راجع [مثال إعادة التشغيل الرشيق أو التوقف](../examples/graceful-restart-or-stop/) لمزيد من التفاصيل.

### لماذا أحصل على "404 Not Found" بدلاً من "405 Method Not Allowed"؟

افتراضياً، يُرجع Gin 404 للمسارات التي لا تدعم طريقة HTTP المطلوبة. لإرجاع 405 Method Not Allowed، فعّل خيار `HandleMethodNotAllowed`.

راجع [الأسئلة الشائعة لـ Method Not Allowed](./method-not-allowed/) للتفاصيل.

### كيف أربط معلمات الاستعلام وبيانات POST معاً؟

استخدم `ShouldBind()` الذي يختار الربط تلقائياً بناءً على نوع المحتوى:

```go
type User struct {
  Name  string `form:"name" json:"name"`
  Email string `form:"email" json:"email"`
  Page  int    `form:"page"`
}

r.POST("/user", func(c *gin.Context) {
  var user User
  // ربط معلمات الاستعلام وجسم الطلب (JSON/form)
  if err := c.ShouldBind(&user); err != nil {
    c.JSON(400, gin.H{"error": err.Error()})
    return
  }
  c.JSON(200, user)
})
```

لمزيد من التحكم، راجع [مثال ربط الاستعلام أو POST](../examples/bind-query-or-post/).

### كيف أتحقق من صحة بيانات الطلب؟

يستخدم Gin [go-playground/validator](https://github.com/go-playground/validator) للتحقق. أضف علامات التحقق إلى بنياتك:

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
  c.JSON(200, gin.H{"message": "المستخدم صالح"})
})
```

للمدققين المخصصين، راجع [مثال المدققين المخصصين](../examples/custom-validators/).

### كيف أشغل Gin في وضع الإنتاج؟

عيّن متغير البيئة `GIN_MODE` إلى `release`:

```sh
export GIN_MODE=release
# أو
GIN_MODE=release ./your-app
```

أو عيّنه برمجياً:

```go
gin.SetMode(gin.ReleaseMode)
```

وضع الإصدار:

- يعطل تسجيل التصحيح
- يحسن الأداء
- يقلل حجم الثنائي قليلاً

### كيف أتعامل مع اتصالات قاعدة البيانات مع Gin؟

استخدم حقن التبعية أو السياق لمشاركة اتصالات قاعدة البيانات:

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

  // الطريقة 1: تمرير db إلى المعالجات
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

  // الطريقة 2: استخدام middleware لحقن db
  r.Use(func(c *gin.Context) {
    c.Set("db", db)
    c.Next()
  })

  r.Run()
}
```

لـ ORM، فكر في استخدام [GORM](https://gorm.io/) مع Gin.

### كيف أختبر معالجات Gin؟

استخدم `net/http/httptest` لاختبار مساراتك:

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

راجع [وثائق الاختبار](../testing/) لمزيد من الأمثلة.

## أسئلة الأداء

### كيف أحسن Gin للحركة العالية؟

1. **استخدم وضع الإصدار**: عيّن `GIN_MODE=release`
2. **عطّل middleware غير الضروري**: استخدم فقط ما تحتاجه
3. **استخدم `gin.New()` بدلاً من `gin.Default()`** إذا كنت تريد التحكم اليدوي في middleware
4. **تجمع الاتصالات**: قم بتكوين تجمعات اتصال قاعدة البيانات بشكل صحيح
5. **التخزين المؤقت**: نفذ التخزين المؤقت للبيانات التي يتم الوصول إليها بشكل متكرر
6. **موازنة الحمل**: استخدم الوكيل العكسي (nginx, HAProxy)
7. **التحليل**: استخدم pprof من Go لتحديد الاختناقات

```go
r := gin.New()
r.Use(gin.Recovery()) // استخدم فقط middleware الاسترداد

// تعيين حدود تجمع الاتصال
db.SetMaxOpenConns(25)
db.SetMaxIdleConns(5)
db.SetConnMaxLifetime(5 * time.Minute)
```

### هل Gin جاهز للإنتاج؟

نعم! يُستخدم Gin في الإنتاج من قبل العديد من الشركات وقد تم اختباره على نطاق واسع. إنه أحد أكثر أطر عمل Go شعبية مع:

- صيانة نشطة ومجتمع
- نظام middleware واسع
- معايير أداء ممتازة
- توافق عكسي قوي

## استكشاف الأخطاء وإصلاحها

### لماذا لا تعمل معلمات المسار الخاصة بي؟

تأكد من أن معلمات المسار تستخدم صيغة `:` ويتم استخراجها بشكل صحيح:

```go
// صحيح
r.GET("/user/:id", func(c *gin.Context) {
  id := c.Param("id")
  c.String(200, "معرف المستخدم: %s", id)
})

// خطأ: /user/{id} أو /user/<id>
```

### لماذا لا يتم تنفيذ middleware الخاص بي؟

يجب تسجيل middleware قبل المسارات أو مجموعات المسارات:

```go
// الترتيب الصحيح
r := gin.New()
r.Use(MyMiddleware()) // سجل middleware أولاً
r.GET("/ping", handler) // ثم المسارات

// لمجموعات المسارات
auth := r.Group("/admin")
auth.Use(AuthMiddleware()) // middleware لهذه المجموعة
{
  auth.GET("/dashboard", handler)
}
```

### لماذا يفشل ربط الطلب؟

أسباب شائعة:

1. **علامات الربط مفقودة**: أضف علامات `json:"field"` أو `form:"field"`
2. **عدم تطابق Content-Type**: تأكد من أن العميل يرسل رأس Content-Type الصحيح
3. **أخطاء التحقق**: تحقق من علامات التحقق والمتطلبات
4. **حقول غير مُصدَّرة**: يتم ربط حقول البنية المُصدَّرة (بحرف كبير) فقط

```go
type User struct {
  Name  string `json:"name" binding:"required"` // ✓ صحيح
  Email string `json:"email"`                    // ✓ صحيح
  age   int    `json:"age"`                      // ✗ لن يتم ربطه (غير مُصدَّر)
}
```
