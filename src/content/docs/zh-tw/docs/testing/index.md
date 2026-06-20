---
title: "測試"
sidebar:
  order: 9
---

## 如何為 Gin 撰寫測試案例？

`net/http/httptest` 套件是進行 HTTP 測試的首選方式。

### 抑制除錯輸出

在測試中建立路由器之前呼叫 `gin.SetMode(gin.TestMode)`。這會抑制 Gin 預設列印的除錯級路由註冊日誌，保持測試輸出乾淨。你可以將其放在 `TestMain` 中，使其適用於套件中的所有測試：

```go
func TestMain(m *testing.M) {
  gin.SetMode(gin.TestMode)
  os.Exit(m.Run())
}
```

### 範例應用程式

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

### 基本測試

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

### 表格驅動測試

表格驅動測試讓你可以涵蓋多種輸入/輸出組合而不重複測試邏輯。此模式是符合 Go 慣例的，且與 Gin 配合得很好：

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

### 測試中介軟體

要單獨測試中介軟體，建立一個套用該中介軟體的最小路由器和一個記錄結果的簡單處理函式：

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
