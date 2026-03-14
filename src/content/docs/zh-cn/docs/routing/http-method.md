---
title: "使用 HTTP 方法"
sidebar:
  order: 1
---

Gin 提供了直接映射到 HTTP 动词的方法，使构建 RESTful API 变得简单直接。每个方法注册一个仅响应对应 HTTP 请求类型的路由：

| 方法        | 典型 REST 用途                      |
| ----------- | ----------------------------------- |
| **GET**     | 获取资源                            |
| **POST**    | 创建新资源                          |
| **PUT**     | 替换现有资源                        |
| **PATCH**   | 部分更新现有资源                    |
| **DELETE**  | 删除资源                            |
| **HEAD**    | 与 GET 相同但不返回响应体           |
| **OPTIONS** | 描述通信选项                        |

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

### 使用 curl 测试

服务器运行后，可以测试每个端点：

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

## 另请参阅

- [路径参数](/zh-cn/docs/routing/param-in-path/)
- [路由分组](/zh-cn/docs/routing/grouping-routes/)
- [查询字符串参数](/zh-cn/docs/routing/querystring-param/)
