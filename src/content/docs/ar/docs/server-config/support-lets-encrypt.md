---
title: "دعم Let's Encrypt"
sidebar:
  order: 3
---

توفر حزمة [gin-gonic/autotls](https://github.com/gin-gonic/autotls) HTTPS تلقائي عبر Let's Encrypt. تتعامل مع إصدار وتجديد الشهادات تلقائياً، بحيث يمكنك تقديم HTTPS بأقل تكوين.

## البداية السريعة

أبسط طريقة هي استدعاء `autotls.Run` مع الموجّه واسم نطاق واحد أو أكثر:

```go
package main

import (
  "log"

  "github.com/gin-gonic/autotls"
  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.GET("/ping", func(c *gin.Context) {
    c.String(200, "pong")
  })

  log.Fatal(autotls.Run(router, "example1.com", "example2.com"))
}
```

## مدير الشهادات التلقائي المخصص

لمزيد من التحكم — مثل تحديد مجلد تخزين الشهادات مؤقتاً أو تقييد أسماء المضيفين المسموح بها — استخدم `autotls.RunWithManager` مع `autocert.Manager` مخصص:

```go
package main

import (
  "log"

  "github.com/gin-gonic/autotls"
  "github.com/gin-gonic/gin"
  "golang.org/x/crypto/acme/autocert"
)

func main() {
  router := gin.Default()

  router.GET("/ping", func(c *gin.Context) {
    c.String(200, "pong")
  })

  m := autocert.Manager{
    Prompt:     autocert.AcceptTOS,
    HostPolicy: autocert.HostWhitelist("example1.com", "example2.com"),
    Cache:      autocert.DirCache("/var/www/.cache"),
  }

  log.Fatal(autotls.RunWithManager(router, &m))
}
```

:::note
يتطلب Let's Encrypt أن يكون خادمك قابلاً للوصول على المنفذ 80 و443 من الإنترنت العام. لن يعمل هذا على localhost أو خلف جدار حماية يحظر الاتصالات الواردة.
:::

## انظر أيضاً

- [تكوين HTTP مخصص](/ar/docs/server-config/custom-http-config/)
