---
title: "Goroutines داخل الوسيطات"
sidebar:
  order: 6
---

عند بدء Goroutines جديدة داخل وسيط أو معالج، **لا ينبغي** استخدام السياق الأصلي بداخلها، بل يجب استخدام نسخة للقراءة فقط.

### لماذا `c.Copy()` ضروري

يستخدم Gin **sync.Pool** لإعادة استخدام كائنات `gin.Context` عبر الطلبات لتحسين الأداء. بمجرد إرجاع المعالج، يُعاد `gin.Context` إلى المجمّع وقد يُسند إلى طلب مختلف تماماً. إذا كان goroutine لا يزال يحمل مرجعاً للسياق الأصلي في تلك النقطة، سيقرأ أو يكتب حقولاً تنتمي الآن لطلب آخر. هذا يؤدي إلى **حالات تسابق** و**تلف البيانات** أو **حالات ذعر**.

استدعاء `c.Copy()` يُنشئ لقطة من السياق آمنة للاستخدام بعد إرجاع المعالج. تتضمن النسخة الطلب وعنوان URL والمفاتيح وبيانات القراءة فقط الأخرى، لكنها منفصلة عن دورة حياة المجمّع.

```go
package main

import (
  "log"
  "time"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.GET("/long_async", func(c *gin.Context) {
    // create copy to be used inside the goroutine
    cCp := c.Copy()
    go func() {
      // simulate a long task with time.Sleep(). 5 seconds
      time.Sleep(5 * time.Second)

      // note that you are using the copied context "cCp", IMPORTANT
      log.Println("Done! in path " + cCp.Request.URL.Path)
    }()
  })

  router.GET("/long_sync", func(c *gin.Context) {
    // simulate a long task with time.Sleep(). 5 seconds
    time.Sleep(5 * time.Second)

    // since we are NOT using a goroutine, we do not have to copy the context
    log.Println("Done! in path " + c.Request.URL.Path)
  })

  // Listen and serve on 0.0.0.0:8080
  router.Run(":8080")
}
```
