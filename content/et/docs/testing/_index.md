---
title: "Testimine"
draft: false
weight: 7
---

## Kuidas kirjutada Gini testjuhtumit?

`net/http/httptest` pakett on eelistatud viis HTTP testimiseks.

```go
package main

import "github.com/gin-gonic/gin"

type User struct {
	Username string `json:"username"`
	Gender   string `json:"gender"`
}

func setupRouter() *gin.Engine {
	r := gin.Default()
	r.GET("/ping", func(c *gin.Context) {
		c.String(200, "pong")
	})
	return r
}

func postUser(r *gin.Engine) *gin.Engine {
	r.POST("/user/add", func(c *gin.Context) {
		var user User
		c.BindJSON(&user)
		c.JSON(200, user)
	})
	return r
}

func main() {
	r := setupRouter()
	r = postUser(r)
	r.Run(":8080")
}
```

Testige ülaltoodud koodi näidet:

```go
package main

import (
	"net/http"
	"net/http/httptest"
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

// Testi POST /user/add
func TestPostUser(t *testing.T) {
	router := setupRouter()
	router = postUser(router)

	w := httptest.NewRecorder()

	// Loo testimiseks näidiskasutaja
	exampleUser := User{
		Username: "test_name",
		Gender:   "male",
	}
	userJson, _ := json.Marshal(exampleUser)
	req, _ := http.NewRequest("POST", "/user/add", strings.NewReader(string(userJson)))
	router.ServeHTTP(w, req)

	assert.Equal(t, 200, w.Code)
	// Võrrelge vastuse keha exampleUser json-andmetega
	assert.Equal(t, string(userJson), w.Body.String())
}
```
