---
title: "وسيط معالجة الأخطاء"
sidebar:
  order: 4
---

في تطبيق RESTful نموذجي، قد تواجه أخطاء في أي مسار مثل:

- مدخلات غير صالحة من المستخدم
- فشل قاعدة البيانات
- وصول غير مُصرّح به
- أخطاء داخلية في الخادم

افتراضياً، يسمح لك Gin بمعالجة الأخطاء يدوياً في كل مسار باستخدام `c.Error(err)`.
لكن هذا يمكن أن يصبح متكرراً وغير متسق بسرعة.

لحل هذا، يمكننا استخدام وسيط مخصص لمعالجة جميع الأخطاء في مكان واحد.
يعمل هذا الوسيط بعد كل طلب ويتحقق من أي أخطاء أُضيفت إلى سياق Gin (`c.Errors`).
إذا وجد خطأ، يُرسل استجابة JSON منظمة مع رمز حالة مناسب.

#### مثال

```go
import (
  "errors"
  "net/http"
  "github.com/gin-gonic/gin"
)

// ErrorHandler captures errors and returns a consistent JSON error response
func ErrorHandler() gin.HandlerFunc {
    return func(c *gin.Context) {
        c.Next() // Step1: Process the request first.

        // Step2: Check if any errors were added to the context
        if len(c.Errors) > 0 {
            // Step3: Use the last error
            err := c.Errors.Last().Err

            // Step4: Respond with a generic error message
            c.JSON(http.StatusInternalServerError, map[string]any{
                "success": false,
                "message": err.Error(),
            })
        }

        // Any other steps if no errors are found
    }
}

func main() {
    r := gin.Default()

    // Attach the error-handling middleware
    r.Use(ErrorHandler())

    r.GET("/ok", func(c *gin.Context) {
        somethingWentWrong := false

        if somethingWentWrong {
            c.Error(errors.New("something went wrong"))
            return
        }

        c.JSON(http.StatusOK, gin.H{
            "success": true,
            "message": "Everything is fine!",
        })
    })

    r.GET("/error", func(c *gin.Context) {
        somethingWentWrong := true

        if somethingWentWrong {
            c.Error(errors.New("something went wrong"))
            return
        }

        c.JSON(http.StatusOK, gin.H{
            "success": true,
            "message": "Everything is fine!",
        })
    })

    r.Run()
}

```

#### التوسعات

- تعيين الأخطاء لرموز الحالة
- إنشاء استجابات خطأ مختلفة بناءً على رموز الخطأ
- تسجيل الأخطاء

#### فوائد وسيط معالجة الأخطاء

- **الاتساق**: جميع الأخطاء تتبع نفس التنسيق
- **مسارات نظيفة**: فصل منطق العمل عن تنسيق الأخطاء
- **تكرار أقل**: لا حاجة لتكرار منطق معالجة الأخطاء في كل معالج
