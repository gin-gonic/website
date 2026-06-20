---
title: "إعادة التشغيل أو الإيقاف الرشيق"
sidebar:
  order: 5
---

عندما تتلقى عملية الخادم إشارة إنهاء (مثلاً أثناء النشر أو حدث التوسع)، يؤدي الإيقاف الفوري إلى إسقاط جميع الطلبات قيد التنفيذ، مما يترك العملاء باتصالات مقطوعة وعمليات قد تكون تالفة. يحل **الإيقاف الرشيق** هذا عن طريق:

- **إكمال الطلبات قيد التنفيذ** -- الطلبات التي تتم معالجتها بالفعل تُمنح وقتاً للانتهاء، حتى يتلقى العملاء استجابات صحيحة بدلاً من إعادة تعيين الاتصال.
- **تصريف الاتصالات** -- يتوقف الخادم عن قبول اتصالات جديدة بينما يُسمح للاتصالات الحالية بالاكتمال.
- **تنظيف الموارد** -- يتم إغلاق اتصالات قاعدة البيانات المفتوحة ومقابض الملفات والعمال الخلفيين بشكل صحيح.
- **تمكين النشر بدون توقف** -- عند دمجه مع موازن حمل، يتيح الإيقاف الرشيق طرح إصدارات جديدة بدون أخطاء مرئية للمستخدم.

هناك عدة طرق لتحقيق ذلك في Go.

يمكننا استخدام [fvbock/endless](https://github.com/fvbock/endless) لاستبدال `ListenAndServe` الافتراضي. راجع المشكلة [#296](https://github.com/gin-gonic/gin/issues/296) لمزيد من التفاصيل.

```go
router := gin.Default()
router.GET("/", handler)
// [...]
endless.ListenAndServe(":4242", router)
```

بدائل لـ endless:

* [manners](https://github.com/braintree/manners): خادم HTTP مؤدب في Go يُغلق بشكل رشيق.
* [graceful](https://github.com/tylerb/graceful): حزمة Go تمكّن الإيقاف الرشيق لخادم http.Handler.
* [grace](https://github.com/facebookgo/grace): إعادة تشغيل رشيقة ونشر بدون توقف لخوادم Go.

إذا كنت تستخدم Go 1.8 وما بعد، قد لا تحتاج لاستخدام هذه المكتبة! فكر في استخدام طريقة [Shutdown()](https://golang.org/pkg/net/http/#Server.Shutdown) المدمجة في `http.Server` للإيقاف الرشيق. راجع مثال [graceful-shutdown](https://github.com/gin-gonic/examples/tree/master/graceful-shutdown) الكامل مع gin.

```go
//go:build go1.8
// +build go1.8

package main

import (
  "context"
  "log"
  "net/http"
  "os"
  "os/signal"
  "syscall"
  "time"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()
  router.GET("/", func(c *gin.Context) {
    time.Sleep(5 * time.Second)
    c.String(http.StatusOK, "Welcome Gin Server")
  })

  srv := &http.Server{
    Addr:    ":8080",
    Handler: router.Handler(),
  }

  go func() {
    // service connections
    if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
      log.Fatalf("listen: %s\n", err)
    }
  }()

  // Wait for interrupt signal to gracefully shutdown the server with
  // a timeout of 5 seconds.
  quit := make(chan os.Signal, 1)
  // kill (no params) by default sends syscall.SIGTERM
  // kill -2 is syscall.SIGINT
  // kill -9 is syscall.SIGKILL but can't be caught, so don't need add it
  signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
  <-quit
  log.Println("Shutdown Server ...")

  ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
  defer cancel()
  if err := srv.Shutdown(ctx); err != nil {
    log.Println("Server Shutdown:", err)
  }
  log.Println("Server exiting")
}
```
