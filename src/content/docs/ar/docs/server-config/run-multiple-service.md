---
title: "تشغيل خدمات متعددة"
sidebar:
  order: 4
---

يمكنك تشغيل عدة خوادم Gin في نفس العملية — كل منها على منفذ مختلف — باستخدام `errgroup.Group` من حزمة `golang.org/x/sync/errgroup`. هذا مفيد عندما تحتاج لكشف واجهات API منفصلة (على سبيل المثال، واجهة API عامة على المنفذ 8080 وواجهة API للإدارة على المنفذ 8081) دون نشر ملفات تنفيذية منفصلة.

كل خادم يحصل على موجّه خاص به ومجموعة وسيط وتكوين `http.Server` خاص.

```go
package main

import (
  "log"
  "net/http"
  "time"

  "github.com/gin-gonic/gin"
  "golang.org/x/sync/errgroup"
)

var (
  g errgroup.Group
)

func router01() http.Handler {
  e := gin.New()
  e.Use(gin.Recovery())
  e.GET("/", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{
      "code":    http.StatusOK,
      "message": "Welcome server 01",
    })
  })

  return e
}

func router02() http.Handler {
  e := gin.New()
  e.Use(gin.Recovery())
  e.GET("/", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{
      "code":    http.StatusOK,
      "message": "Welcome server 02",
    })
  })

  return e
}

func main() {
  server01 := &http.Server{
    Addr:         ":8080",
    Handler:      router01(),
    ReadTimeout:  5 * time.Second,
    WriteTimeout: 10 * time.Second,
  }

  server02 := &http.Server{
    Addr:         ":8081",
    Handler:      router02(),
    ReadTimeout:  5 * time.Second,
    WriteTimeout: 10 * time.Second,
  }

  g.Go(func() error {
    return server01.ListenAndServe()
  })

  g.Go(func() error {
    return server02.ListenAndServe()
  })

  if err := g.Wait(); err != nil {
    log.Fatal(err)
  }
}
```

## اختبره

```sh
# Server 01 on port 8080
curl http://localhost:8080/
# Output: {"code":200,"message":"Welcome server 01"}

# Server 02 on port 8081
curl http://localhost:8081/
# Output: {"code":200,"message":"Welcome server 02"}
```

:::note
إذا فشل أي خادم في البدء (على سبيل المثال، إذا كان المنفذ مستخدماً بالفعل)، يُرجع `g.Wait()` الخطأ الأول. يجب أن يبدأ كلا الخادمين بنجاح حتى تستمر العملية في العمل.
:::

## انظر أيضاً

- [تكوين HTTP مخصص](/ar/docs/server-config/custom-http-config/)
- [إعادة التشغيل أو الإيقاف بأمان](/ar/docs/server-config/graceful-restart-or-stop/)
