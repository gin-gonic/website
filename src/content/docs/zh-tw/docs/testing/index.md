---
title: "測試"
sidebar:
  order: 7
---

## 如何為 Gin 寫測試案例？

傾向使用 `net/http/httptest` 套件來做 HTTP 測試。

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

func postUser(r *gin.Engine) *gin.Engine {
	r.POST("/user/add", func(c *gin.Context) {
		var user User
		if err := c.BindJSON(&user); err == nil {
			c.JSON(200, user)
		} else {
			c.JSON(400, gin.H{"error": err.Error()})
		}
	})
	return r
}

func main() {
	r := setupRouter()
	r = postUser(r)
	r.Run(":8080")
}
```

為上述程式碼所寫的測試：

```go
package main

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

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

// 測試 POST /user/add
func TestPostUser(t *testing.T) {
	router := setupRouter()
	router = postUser(router)

	w := httptest.NewRecorder()

	// 建立一個用於測試的範例使用者
	exampleUser := User{
		Username: "test_name",
		Gender:   "male",
	}
	userJson, _ := json.Marshal(exampleUser)
	req, _ := http.NewRequest("POST", "/user/add", strings.NewReader(string(userJson)))
	req.Header.Set("Content-Type", "application/json")
	router.ServeHTTP(w, req)

	assert.Equal(t, 200, w.Code)
	// 比較回應主體與範例使用者的 JSON 資料
	assert.Equal(t, string(userJson), w.Body.String())
}
```
