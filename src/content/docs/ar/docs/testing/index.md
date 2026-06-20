---
title: "الاختبار"
sidebar:
  order: 9
---

## كيف تكتب حالات اختبار لـ Gin؟

حزمة `net/http/httptest` هي الطريقة المفضلة لاختبار HTTP.

### إخفاء مخرجات التصحيح

استدعِ `gin.SetMode(gin.TestMode)` قبل إنشاء الموجّه في اختباراتك. هذا يخفي سجلات تسجيل المسارات على مستوى التصحيح التي يطبعها Gin افتراضياً، مما يبقي مخرجات اختباراتك نظيفة. يمكنك وضع هذا في `TestMain` ليُطبق على جميع الاختبارات في الحزمة:

```go
func TestMain(m *testing.M) {
  gin.SetMode(gin.TestMode)
  os.Exit(m.Run())
}
```

### تطبيق مثال

```go
package main

import "github.com/gin-gonic/gin"

type User struct {
  Username string `json:"username"`
  Gender   string `json:"gender"`
}

func setupRouter() *gin.Engine {
  router := gin.Default()
  router.GET("/ping", func(c *gin.Context) {
    c.String(200, "pong")
  })
  return router
}

func postUser(router *gin.Engine) *gin.Engine {
  router.POST("/user/add", func(c *gin.Context) {
    var user User
    c.BindJSON(&user)
    c.JSON(200, user)
  })
  return router
}

func main() {
  router := setupRouter()
  router = postUser(router)
  router.Run(":8080")
}
```

### اختبارات أساسية

```go
package main

import (
  "net/http"
  "net/http/httptest"
  "encoding/json"
  "testing"
  "strings"

  "github.com/stretchr/testify/assert"
)

func TestPingRoute(t *testing.T) {
  router := setupRouter()

  w := httptest.NewRecorder()
  req, _ := http.NewRequest("GET", "/ping", nil)
  router.ServeHTTP(w, req)

  assert.Equal(t, 200, w.Code)
  assert.Equal(t, "pong", w.Body.String())
}

// Test for POST /user/add
func TestPostUser(t *testing.T) {
  router := setupRouter()
  router = postUser(router)

  w := httptest.NewRecorder()

  // Create an example user for testing
  exampleUser := User{
    Username: "test_name",
    Gender:   "male",
  }
  userJson, _ := json.Marshal(exampleUser)
  req, _ := http.NewRequest("POST", "/user/add", strings.NewReader(string(userJson)))
  router.ServeHTTP(w, req)

  assert.Equal(t, 200, w.Code)
  // Compare the response body with the json data of exampleUser
  assert.Equal(t, string(userJson), w.Body.String())
}
```

### اختبارات مبنية على الجداول

تتيح لك الاختبارات المبنية على الجداول تغطية العديد من مجموعات المدخلات/المخرجات دون تكرار منطق الاختبار. هذا النمط اصطلاحي في Go ويعمل بشكل جيد مع Gin:

```go
func TestPingRouteTableDriven(t *testing.T) {
  router := setupRouter()

  tests := []struct {
    name       string
    method     string
    path       string
    wantCode   int
    wantBody   string
  }{
    {"ping endpoint", "GET", "/ping", 200, "pong"},
    {"not found", "GET", "/nonexistent", 404, ""},
  }

  for _, tt := range tests {
    t.Run(tt.name, func(t *testing.T) {
      w := httptest.NewRecorder()
      req, _ := http.NewRequest(tt.method, tt.path, nil)
      router.ServeHTTP(w, req)

      assert.Equal(t, tt.wantCode, w.Code)
      if tt.wantBody != "" {
        assert.Equal(t, tt.wantBody, w.Body.String())
      }
    })
  }
}
```

### اختبار الوسيطات

لاختبار وسيط بشكل منفصل، أنشئ موجّهاً بسيطاً مع الوسيط المُطبق ومعالج بسيط يسجّل النتيجة:

```go
func TestAuthMiddleware(t *testing.T) {
  gin.SetMode(gin.TestMode)

  // Create a router with the middleware under test
  router := gin.New()
  router.Use(AuthRequired()) // your middleware

  router.GET("/protected", func(c *gin.Context) {
    c.String(200, "ok")
  })

  // Test without credentials -- expect 401
  w := httptest.NewRecorder()
  req, _ := http.NewRequest("GET", "/protected", nil)
  router.ServeHTTP(w, req)
  assert.Equal(t, 401, w.Code)

  // Test with valid credentials -- expect 200
  w = httptest.NewRecorder()
  req, _ = http.NewRequest("GET", "/protected", nil)
  req.Header.Set("Authorization", "Bearer valid-token")
  router.ServeHTTP(w, req)
  assert.Equal(t, 200, w.Code)
}
```
