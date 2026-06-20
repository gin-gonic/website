---
title: "الأسئلة الشائعة"
sidebar:
  order: 15
---

## أسئلة عامة

### كيف أفعّل إعادة التحميل المباشر أثناء التطوير؟

استخدم [Air](https://github.com/air-verse/air) لإعادة التحميل المباشر التلقائي أثناء التطوير. يراقب Air ملفاتك ويعيد بناء/تشغيل تطبيقك عند اكتشاف تغييرات.

**التثبيت:**

```sh
go install github.com/air-verse/air@latest
```

**الإعداد:**

أنشئ ملف تكوين `.air.toml` في جذر مشروعك:

```sh
air init
```

ثم شغّل `air` في مجلد مشروعك بدلاً من `go run`:

```sh
air
```

سيراقب Air ملفات `.go` ويعيد بناء/تشغيل تطبيق Gin تلقائياً عند التغييرات. راجع [توثيق Air](https://github.com/air-verse/air) لخيارات التكوين.

### كيف أتعامل مع CORS في Gin؟

استخدم وسيط [gin-contrib/cors](https://github.com/gin-contrib/cors) الرسمي:

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

للحصول على نظرة أمنية شاملة، راجع [أفضل ممارسات الأمان](/ar/docs/middleware/security-guide/).

### كيف أقدم الملفات الثابتة؟

استخدم `Static()` أو `StaticFS()` لتقديم الملفات الثابتة:

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

راجع [تقديم البيانات من ملف](/ar/docs/rendering/serving-data-from-file/) لمزيد من التفاصيل.

### كيف أتعامل مع رفع الملفات؟

استخدم `FormFile()` لملف واحد أو `MultipartForm()` لملفات متعددة:

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

راجع توثيق [رفع الملفات](/ar/docs/routing/upload-file/) لمزيد من التفاصيل.

### كيف أنفّذ المصادقة باستخدام JWT؟

استخدم [gin-contrib/jwt](https://github.com/gin-contrib/jwt) أو نفّذ وسيطاً مخصصاً. إليك مثالاً بسيطاً:

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

للمصادقة المبنية على الجلسات، راجع [إدارة الجلسات](/ar/docs/middleware/session-management/).

### كيف أعدّ تسجيل الطلبات؟

يتضمن Gin وسيط مسجّل افتراضي عبر `gin.Default()`. للتسجيل المنظم بتنسيق JSON في الإنتاج، راجع [التسجيل المنظم](/ar/docs/logging/structured-logging/).

لتخصيص السجل الأساسي:

```go
r := gin.New()
r.Use(gin.LoggerWithConfig(gin.LoggerConfig{
  SkipPaths: []string{"/healthz"},
}))
r.Use(gin.Recovery())
```

راجع قسم [التسجيل](/ar/docs/logging/) لجميع الخيارات بما في ذلك التنسيقات المخصصة ومخرجات الملفات وتخطي سلاسل الاستعلام.

### كيف أتعامل مع الإيقاف الرشيق؟

راجع [إعادة التشغيل أو الإيقاف الرشيق](/ar/docs/server-config/graceful-restart-or-stop/) للحصول على دليل كامل مع أمثلة الكود.

### لماذا أحصل على "404 Not Found" بدلاً من "405 Method Not Allowed"؟

افتراضياً، يُرجع Gin 404 للمسارات التي لا تدعم طريقة HTTP المطلوبة. عيّن `HandleMethodNotAllowed = true` لإرجاع 405 بدلاً من ذلك:

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

### كيف أربط معاملات الاستعلام وبيانات POST معاً؟

استخدم `ShouldBind()` الذي يختار الربط تلقائياً بناءً على نوع المحتوى:

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

راجع قسم [الربط](/ar/docs/binding/) لجميع خيارات الربط.

### كيف أتحقق من صحة بيانات الطلب؟

يستخدم Gin [go-playground/validator](https://github.com/go-playground/validator) للتحقق. أضف علامات التحقق إلى هياكلك:

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

راجع [ربط النموذج والتحقق](/ar/docs/binding/binding-and-validation/) للمحققين المخصصين والاستخدام المتقدم.

### كيف أشغّل Gin في وضع الإنتاج؟

عيّن متغير البيئة `GIN_MODE` إلى `release`:

```sh
export GIN_MODE=release
# or
GIN_MODE=release ./your-app
```

أو عيّنه برمجياً:

```go
gin.SetMode(gin.ReleaseMode)
```

يعطّل وضع الإصدار تسجيل التصحيح ويحسّن الأداء.

### كيف أتعامل مع اتصالات قاعدة البيانات مع Gin؟

راجع [تكامل قاعدة البيانات](/ar/docs/server-config/database/) للحصول على دليل كامل يغطي `database/sql` وGORM وتجميع الاتصالات وأنماط حقن الاعتماديات.

### كيف أختبر معالجات Gin؟

استخدم `net/http/httptest` لاختبار مساراتك:

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

راجع توثيق [الاختبار](/ar/docs/testing/) لمزيد من الأمثلة.

## أسئلة الأداء

### كيف أحسّن Gin لحركة المرور العالية؟

1. **استخدم وضع الإصدار**: عيّن `GIN_MODE=release`
2. **عطّل الوسيطات غير الضرورية**: استخدم فقط ما تحتاجه
3. **استخدم `gin.New()` بدلاً من `gin.Default()`** للتحكم اليدوي في الوسيطات
4. **تجميع الاتصالات**: كوّن تجمعات اتصالات قاعدة البيانات (راجع [تكامل قاعدة البيانات](/ar/docs/server-config/database/))
5. **التخزين المؤقت**: نفّذ التخزين المؤقت للبيانات المطلوبة بشكل متكرر
6. **موازنة الحمل**: استخدم وكيلاً عكسياً (nginx، HAProxy)
7. **التنميط**: استخدم pprof من Go لتحديد الاختناقات
8. **المراقبة**: أعدّ [المقاييس والمراقبة](/ar/docs/server-config/metrics/) لتتبع الأداء

### هل Gin جاهز للإنتاج؟

نعم. يُستخدم Gin في الإنتاج من قبل العديد من الشركات وقد تم اختباره على نطاق واسع. راجع [المستخدمون](/ar/docs/users/) لأمثلة على المشاريع التي تستخدم Gin في الإنتاج.

## استكشاف الأخطاء وإصلاحها

### لماذا لا تعمل معاملات المسار؟

تأكد من أن معاملات المسار تستخدم صيغة `:` ويتم استخراجها بشكل صحيح:

```go
// Correct
r.GET("/user/:id", func(c *gin.Context) {
  id := c.Param("id")
  c.String(200, "User ID: %s", id)
})

// Not: /user/{id} or /user/<id>
```

راجع [المعاملات في المسار](/ar/docs/routing/param-in-path/) للتفاصيل.

### لماذا لا يتم تنفيذ الوسيط؟

يجب تسجيل الوسيطات قبل المسارات أو مجموعات المسارات:

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

راجع [استخدام الوسيطات](/ar/docs/middleware/using-middleware/) للتفاصيل.

### لماذا يفشل ربط الطلب؟

الأسباب الشائعة:

1. **علامات ربط مفقودة**: أضف علامات `json:"field"` أو `form:"field"`
2. **عدم تطابق Content-Type**: تأكد من أن العميل يرسل ترويسة Content-Type الصحيحة
3. **أخطاء التحقق**: تحقق من علامات التحقق والمتطلبات
4. **حقول غير مُصدّرة**: فقط حقول الهيكل المُصدّرة (بحرف كبير) يتم ربطها

```go
type User struct {
  Name  string `json:"name" binding:"required"` // ✓ Correct
  Email string `json:"email"`                    // ✓ Correct
  age   int    `json:"age"`                      // ✗ Won't bind (unexported)
}
```

راجع [ربط النموذج والتحقق](/ar/docs/binding/binding-and-validation/) للتفاصيل.
