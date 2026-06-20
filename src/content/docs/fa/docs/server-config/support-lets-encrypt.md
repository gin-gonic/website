---
title: "پشتیبانی از Let's Encrypt"
sidebar:
  order: 3
---

پکیج [gin-gonic/autotls](https://github.com/gin-gonic/autotls) امکان HTTPS خودکار از طریق Let's Encrypt را فراهم می‌کند. این پکیج صدور و تمدید گواهی‌نامه را به‌صورت خودکار انجام می‌دهد، بنابراین می‌توانید با حداقل پیکربندی HTTPS ارائه دهید.

## شروع سریع

ساده‌ترین روش فراخوانی `autotls.Run` با روتر و یک یا چند نام دامنه است:

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

## مدیر گواهی خودکار سفارشی

برای کنترل بیشتر -- مانند مشخص کردن دایرکتوری کش گواهی یا محدود کردن نام‌های میزبان مجاز -- از `autotls.RunWithManager` با یک `autocert.Manager` سفارشی استفاده کنید:

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
Let's Encrypt نیاز دارد که سرور شما روی پورت 80 و 443 از اینترنت عمومی قابل دسترسی باشد. این روی localhost یا پشت فایروالی که اتصالات ورودی را مسدود می‌کند کار نخواهد کرد.
:::

## همچنین ببینید

- [پیکربندی HTTP سفارشی](/fa/docs/server-config/custom-http-config/)
