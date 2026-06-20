---
title: "使用 HTTP 方法"
sidebar:
  order: 1
---

Gin 提供了直接對應 HTTP 動詞的方法，讓建構 RESTful API 變得簡單直覺。每個方法註冊一個僅回應對應 HTTP 請求類型的路由：

| 方法        | 典型 REST 用途                      |
| ----------- | ----------------------------------- |
| **GET**     | 取得資源                            |
| **POST**    | 建立新資源                          |
| **PUT**     | 取代現有資源                        |
| **PATCH**   | 部分更新現有資源                    |
| **DELETE**  | 刪除資源                            |
| **HEAD**    | 與 GET 相同但不含回應主體           |
| **OPTIONS** | 描述通訊選項                        |

```go
package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func getting(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"method": "GET"})
}

func posting(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"method": "POST"})
}

func putting(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"method": "PUT"})
}

func deleting(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"method": "DELETE"})
}

func patching(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"method": "PATCH"})
}

func head(c *gin.Context) {
	c.Status(http.StatusOK)
}

func options(c *gin.Context) {
	c.Status(http.StatusOK)
}

func main() {
	// Creates a gin router with default middleware:
	// logger and recovery (crash-free) middleware
	router := gin.Default()

	router.GET("/someGet", getting)
	router.POST("/somePost", posting)
	router.PUT("/somePut", putting)
	router.DELETE("/someDelete", deleting)
	router.PATCH("/somePatch", patching)
	router.HEAD("/someHead", head)
	router.OPTIONS("/someOptions", options)

	// By default it serves on :8080 unless a
	// PORT environment variable was defined.
	router.Run()
	// router.Run(":3000") for a hard coded port
}
```

### 使用 curl 測試

伺服器執行後，你可以測試每個端點：

```sh
# GET request
curl -X GET http://localhost:8080/someGet

# POST request
curl -X POST http://localhost:8080/somePost

# PUT request
curl -X PUT http://localhost:8080/somePut

# DELETE request
curl -X DELETE http://localhost:8080/someDelete

# PATCH request
curl -X PATCH http://localhost:8080/somePatch

# HEAD request (returns headers only, no body)
curl -I http://localhost:8080/someHead

# OPTIONS request
curl -X OPTIONS http://localhost:8080/someOptions
```

## 另請參閱

- [路徑參數](/zh-tw/docs/routing/param-in-path/)
- [路由分組](/zh-tw/docs/routing/grouping-routes/)
- [查詢字串參數](/zh-tw/docs/routing/querystring-param/)
