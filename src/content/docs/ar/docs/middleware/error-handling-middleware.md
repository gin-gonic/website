---
title: "وسيط معالجة الأخطاء"
sidebar:
  order: 4
---

في تطبيق RESTful نموذجي، قد تواجه أخطاء في أي مسار — مدخلات غير صالحة، فشل قاعدة البيانات، وصول غير مصرّح به، أو أخطاء داخلية. معالجة الأخطاء بشكل فردي في كل معالج تؤدي إلى كود متكرر واستجابات غير متسقة.

وسيط معالجة الأخطاء المركزي يحل هذه المشكلة بالعمل بعد كل طلب والتحقق من أي أخطاء أُضيفت إلى سياق Gin عبر `c.Error(err)`. إذا وُجدت أخطاء، يُرسل استجابة JSON منظمة مع رمز حالة مناسب.

```go
package main

import (
  "errors"
  "net/http"

  "github.com/gin-gonic/gin"
)

// ErrorHandler captures errors and returns a consistent JSON error response
func ErrorHandler() gin.HandlerFunc {
  return func(c *gin.Context) {
    c.Next() // Process the request first

    // Check if any errors were added to the context
    if len(c.Errors) > 0 {
      err := c.Errors.Last().Err

      c.JSON(http.StatusInternalServerError, gin.H{
        "success": false,
        "message": err.Error(),
      })
    }
  }
}

func main() {
  r := gin.Default()

  // Attach the error-handling middleware
  r.Use(ErrorHandler())

  r.GET("/ok", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{
      "success": true,
      "message": "Everything is fine!",
    })
  })

  r.GET("/error", func(c *gin.Context) {
    c.Error(errors.New("something went wrong"))
  })

  r.Run(":8080")
}
```

## اختبره

```sh
# Successful request
curl http://localhost:8080/ok
# Output: {"message":"Everything is fine!","success":true}

# Error request -- middleware catches the error
curl http://localhost:8080/error
# Output: {"message":"something went wrong","success":false}
```

:::tip
يمكنك توسيع هذا النمط لربط أنواع أخطاء محددة برموز حالة HTTP مختلفة، أو لتسجيل الأخطاء في خدمة خارجية قبل الاستجابة.
:::

## انظر أيضاً

- [وسيط مخصص](/ar/docs/middleware/custom-middleware/)
- [استخدام الوسيط](/ar/docs/middleware/using-middleware/)
