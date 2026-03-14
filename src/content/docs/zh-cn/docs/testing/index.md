---
title: "测试"
sidebar:
  order: 9
---

## 如何为 Gin 编写测试用例？

`net/http/httptest` 包是进行 HTTP 测试的首选方式。

### 抑制调试输出

在测试中创建路由器之前调用 `gin.SetMode(gin.TestMode)`。这会抑制 Gin 默认打印的调试级别路由注册日志，保持测试输出整洁。你可以将其放在 `TestMain` 中，使其应用于包中的所有测试：

```go
func TestMain(m *testing.M) {
  gin.SetMode(gin.TestMode)
  os.Exit(m.Run())
}
```

### 示例应用

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

### 基本测试

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

### 表驱动测试

表驱动测试让你可以覆盖多种输入/输出组合而不重复测试逻辑。这种模式是 Go 的惯用方式，与 Gin 配合良好：

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

### 测试中间件

要单独测试中间件，创建一个应用了中间件的最小路由器和一个记录结果的简单处理函数：

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
