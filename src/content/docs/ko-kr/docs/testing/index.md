---
title: "테스트"
sidebar:
  order: 9
---

## Gin의 테스트 케이스 작성 방법

`net/http/httptest` 패키지는 HTTP 테스트에 권장되는 방법입니다.

### 디버그 출력 억제

테스트에서 라우터를 생성하기 전에 `gin.SetMode(gin.TestMode)`를 호출하세요. 이는 Gin이 기본적으로 출력하는 디버그 수준의 라우트 등록 로그를 억제하여 테스트 출력을 깔끔하게 유지합니다. `TestMain`에 배치하면 패키지의 모든 테스트에 적용됩니다:

```go
func TestMain(m *testing.M) {
  gin.SetMode(gin.TestMode)
  os.Exit(m.Run())
}
```

### 예제 애플리케이션

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

### 기본 테스트

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

// POST /user/add 테스트
func TestPostUser(t *testing.T) {
  router := setupRouter()
  router = postUser(router)

  w := httptest.NewRecorder()

  // 테스트용 사용자 예제 생성
  exampleUser := User{
    Username: "test_name",
    Gender:   "male",
  }
  userJson, _ := json.Marshal(exampleUser)
  req, _ := http.NewRequest("POST", "/user/add", strings.NewReader(string(userJson)))
  router.ServeHTTP(w, req)

  assert.Equal(t, 200, w.Code)
  // 응답 바디를 exampleUser의 json 데이터와 비교
  assert.Equal(t, string(userJson), w.Body.String())
}
```

### 테이블 기반 테스트

테이블 기반 테스트는 테스트 로직을 중복하지 않고 많은 입력/출력 조합을 다룰 수 있게 합니다. 이 패턴은 관용적 Go이며 Gin과 잘 작동합니다:

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
    {"ping 엔드포인트", "GET", "/ping", 200, "pong"},
    {"찾을 수 없음", "GET", "/nonexistent", 404, ""},
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

### 미들웨어 테스트

미들웨어를 독립적으로 테스트하려면 미들웨어가 적용된 최소한의 라우터와 결과를 기록하는 간단한 핸들러를 생성합니다:

```go
func TestAuthMiddleware(t *testing.T) {
  gin.SetMode(gin.TestMode)

  // 테스트 대상 미들웨어가 적용된 라우터 생성
  router := gin.New()
  router.Use(AuthRequired()) // 미들웨어

  router.GET("/protected", func(c *gin.Context) {
    c.String(200, "ok")
  })

  // 자격 증명 없이 테스트 -- 401 기대
  w := httptest.NewRecorder()
  req, _ := http.NewRequest("GET", "/protected", nil)
  router.ServeHTTP(w, req)
  assert.Equal(t, 401, w.Code)

  // 유효한 자격 증명으로 테스트 -- 200 기대
  w = httptest.NewRecorder()
  req, _ = http.NewRequest("GET", "/protected", nil)
  req.Header.Set("Authorization", "Bearer valid-token")
  router.ServeHTTP(w, req)
  assert.Equal(t, 200, w.Code)
}
```
