---
title: "PureJSON"
sidebar:
  order: 5
---

به‌طور معمول، `json.Marshal` در Go کاراکترهای خاص HTML را برای امنیت با دنباله‌های فرار یونیکد جایگزین می‌کند -- به‌عنوان مثال، `<` به `\u003c` تبدیل می‌شود. این برای جاسازی JSON در HTML مناسب است، اما اگر در حال ساخت یک API خالص هستید، کلاینت‌ها ممکن است انتظار کاراکترهای واقعی را داشته باشند.

`c.PureJSON` از `json.Encoder` با `SetEscapeHTML(false)` استفاده می‌کند، بنابراین کاراکترهای HTML مانند `<`، `>` و `&` به‌صورت واقعی رندر می‌شوند به‌جای اینکه فرار داده شوند.

از `PureJSON` زمانی استفاده کنید که مصرف‌کنندگان API شما انتظار JSON خام و بدون فرار دارند. از `JSON` استاندارد زمانی استفاده کنید که پاسخ ممکن است در یک صفحه HTML جاسازی شود.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  // Standard JSON -- escapes HTML characters
  router.GET("/json", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{
      "html": "<b>Hello, world!</b>",
    })
  })

  // PureJSON -- serves literal characters
  router.GET("/purejson", func(c *gin.Context) {
    c.PureJSON(http.StatusOK, gin.H{
      "html": "<b>Hello, world!</b>",
    })
  })

  router.Run(":8080")
}
```

## تست

```sh
# Standard JSON -- HTML characters are escaped
curl http://localhost:8080/json
# Output: {"html":"\u003cb\u003eHello, world!\u003c/b\u003e"}

# PureJSON -- HTML characters are literal
curl http://localhost:8080/purejson
# Output: {"html":"<b>Hello, world!</b>"}
```

:::tip
Gin همچنین `c.AbortWithStatusPureJSON` (نسخه 1.11 به بعد) را برای برگرداندن JSON بدون فرار هنگام متوقف کردن زنجیره میان‌افزار ارائه می‌دهد -- مفید در میان‌افزارهای احراز هویت یا اعتبارسنجی.
:::

## همچنین ببینید

- [AsciiJSON](/fa/docs/rendering/ascii-json/)
- [SecureJSON](/fa/docs/rendering/secure-json/)
- [رندرینگ](/fa/docs/rendering/rendering/)
