---
title: "Тестирование"
черновик: false
вес: 7
---

## Как написать тестовый пример для Gin?

Пакет `net/http/httptest` является предпочтительным способом для тестирования HTTP.

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

Тест для примера кода, приведенного выше:

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
