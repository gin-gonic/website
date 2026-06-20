---
title: "استخدام طرق HTTP"
sidebar:
  order: 1
---

يوفر Gin طرقاً تتوافق مباشرة مع أفعال HTTP، مما يسهل بناء واجهات RESTful البرمجية. كل طريقة تسجل مساراً يستجيب فقط لنوع طلب HTTP المقابل:

| الطريقة     | الاستخدام النموذجي في REST            |
| ----------- | ----------------------------------- |
| **GET**     | استرجاع مورد                        |
| **POST**    | إنشاء مورد جديد                     |
| **PUT**     | استبدال مورد موجود                   |
| **PATCH**   | تحديث جزئي لمورد موجود              |
| **DELETE**  | حذف مورد                           |
| **HEAD**    | مثل GET لكن بدون جسم الاستجابة      |
| **OPTIONS** | وصف خيارات الاتصال                  |

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

### الاختبار باستخدام curl

بمجرد تشغيل الخادم، يمكنك اختبار كل نقطة نهاية:

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

## انظر أيضاً

- [المعاملات في المسار](/ar/docs/routing/param-in-path/)
- [تجميع المسارات](/ar/docs/routing/grouping-routes/)
- [معاملات سلسلة الاستعلام](/ar/docs/routing/querystring-param/)
