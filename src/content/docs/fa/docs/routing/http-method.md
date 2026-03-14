---
title: "استفاده از متد HTTP"
sidebar:
  order: 1
---

Gin متدهایی ارائه می‌دهد که مستقیماً به افعال HTTP نگاشت می‌شوند و ساخت API‌های RESTful را ساده می‌کنند. هر متد یک مسیر ثبت می‌کند که فقط به نوع درخواست HTTP مربوطه پاسخ می‌دهد:

| متد         | استفاده معمول REST                    |
| ----------- | ------------------------------------- |
| **GET**     | دریافت یک منبع                       |
| **POST**    | ایجاد یک منبع جدید                   |
| **PUT**     | جایگزینی یک منبع موجود               |
| **PATCH**   | به‌روزرسانی جزئی یک منبع موجود       |
| **DELETE**  | حذف یک منبع                          |
| **HEAD**    | مانند GET اما بدون بدنه              |
| **OPTIONS** | توصیف گزینه‌های ارتباط               |

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

### تست با curl

پس از اجرای سرور، می‌توانید هر نقطه پایانی را تست کنید:

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

## همچنین ببینید

- [پارامترها در مسیر](/en/docs/routing/param-in-path/)
- [گروه‌بندی مسیرها](/en/docs/routing/grouping-routes/)
- [پارامترهای رشته پرس‌وجو](/en/docs/routing/querystring-param/)
