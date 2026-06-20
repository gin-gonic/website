---
title: "كيفية كتابة ملف السجل"
sidebar:
  order: 1
---

كتابة السجلات إلى ملف أمر ضروري لتطبيقات الإنتاج حيث تحتاج للاحتفاظ بسجل الطلبات للتصحيح أو المراجعة أو المراقبة. افتراضياً، يكتب Gin جميع مخرجات السجل إلى `os.Stdout`. يمكنك إعادة توجيه ذلك بتعيين `gin.DefaultWriter` قبل إنشاء الموجّه.

```go
package main

import (
  "io"
  "os"

  "github.com/gin-gonic/gin"
)

func main() {
    // Disable Console Color, you don't need console color when writing the logs to file.
    gin.DisableConsoleColor()

    // Logging to a file.
    f, _ := os.Create("gin.log")
    gin.DefaultWriter = io.MultiWriter(f)

    // Use the following code if you need to write the logs to file and console at the same time.
    // gin.DefaultWriter = io.MultiWriter(f, os.Stdout)

    router := gin.Default()
    router.GET("/ping", func(c *gin.Context) {
        c.String(200, "pong")
    })

    router.Run(":8080")
}
```

### الكتابة إلى كل من الملف ووحدة التحكم

تقبل دالة `io.MultiWriter` من مكتبة Go القياسية عدة قيم `io.Writer` وتكرر الكتابة إلى جميعها. هذا مفيد أثناء التطوير عندما تريد رؤية السجلات في الطرفية مع حفظها أيضاً على القرص:

```go
f, _ := os.Create("gin.log")
gin.DefaultWriter = io.MultiWriter(f, os.Stdout)
```

مع هذا الإعداد، يُكتب كل إدخال سجل إلى كل من `gin.log` ووحدة التحكم في نفس الوقت.

### تدوير السجلات في بيئة الإنتاج

يستخدم المثال أعلاه `os.Create`، الذي يقطع ملف السجل في كل مرة يبدأ فيها التطبيق. في بيئة الإنتاج، تريد عادةً الإلحاق بالسجلات الموجودة وتدوير الملفات بناءً على الحجم أو الوقت. فكر في استخدام مكتبة تدوير السجلات مثل [lumberjack](https://github.com/natefinch/lumberjack):

```go
import "gopkg.in/natefinch/lumberjack.v2"

func main() {
    gin.DisableConsoleColor()

    gin.DefaultWriter = &lumberjack.Logger{
        Filename:   "gin.log",
        MaxSize:    100, // megabytes
        MaxBackups: 3,
        MaxAge:     28, // days
    }

    router := gin.Default()
    router.GET("/ping", func(c *gin.Context) {
        c.String(200, "pong")
    })

    router.Run(":8080")
}
```

### انظر أيضاً

- [تنسيق سجل مخصص](../custom-log-format/) -- تحديد تنسيق سطر السجل الخاص بك.
- [التحكم في تلوين مخرجات السجل](../controlling-log-output-coloring/) -- تعطيل أو فرض المخرجات الملونة.
- [تخطي التسجيل](../skip-logging/) -- استبعاد مسارات محددة من التسجيل.
