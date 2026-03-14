---
title: "JSONP"
sidebar:
  order: 3
---

JSONP (JSON با Padding) تکنیکی برای ارسال درخواست‌های بین‌دامنه‌ای از مرورگرهایی است که قبل از پشتیبانی CORS بودند. این کار با بسته‌بندی پاسخ JSON در یک فراخوانی تابع JavaScript انجام می‌شود. مرورگر پاسخ را از طریق تگ `<script>` بارگذاری می‌کند که مشمول سیاست same-origin نیست و تابع بسته‌بندی با داده به عنوان آرگومان اجرا می‌شود.

وقتی `c.JSONP()` را فراخوانی می‌کنید، Gin پارامتر پرس‌وجوی `callback` را بررسی می‌کند. در صورت وجود، بدنه پاسخ به صورت `callbackName({"foo":"bar"})` با `Content-Type` برابر `application/javascript` بسته‌بندی می‌شود. اگر callback ارائه نشود، پاسخ مانند فراخوانی استاندارد `c.JSON()` رفتار می‌کند.

:::note
JSONP یک تکنیک قدیمی است. برای برنامه‌های مدرن، به جای آن از [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) استفاده کنید. CORS امن‌تر است، از تمام متدهای HTTP (نه فقط GET) پشتیبانی می‌کند و نیاز به بسته‌بندی پاسخ‌ها در callbackها ندارد. از JSONP فقط زمانی استفاده کنید که نیاز به پشتیبانی از مرورگرهای بسیار قدیمی دارید یا با سیستم‌های شخص ثالثی که آن را نیاز دارند یکپارچه می‌شوید.
:::

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.GET("/JSONP", func(c *gin.Context) {
    data := map[string]interface{}{
      "foo": "bar",
    }

    // The callback name is read from the query string, e.g.:
    // GET /JSONP?callback=x
    // Will output  :   x({\"foo\":\"bar\"})
    c.JSONP(http.StatusOK, data)
  })

  // Listen and serve on 0.0.0.0:8080
  router.Run(":8080")
}
```

با curl تست کنید تا تفاوت بین پاسخ‌های JSONP و JSON ساده را ببینید:

```sh
# With callback -- returns JavaScript
curl "http://localhost:8080/JSONP?callback=handleData"
# Output: handleData({"foo":"bar"});

# Without callback -- returns plain JSON
curl "http://localhost:8080/JSONP"
# Output: {"foo":"bar"}
```

:::caution[ملاحظات امنیتی]
نقاط پایانی JSONP می‌توانند در صورت عدم پاکسازی مناسب پارامتر callback در برابر حملات XSS آسیب‌پذیر باشند. یک مقدار callback مخرب مانند `alert(document.cookie)//` می‌تواند JavaScript دلخواه تزریق کند. Gin با پاکسازی نام callback و حذف کاراکترهایی که می‌توانند برای تزریق استفاده شوند، این مشکل را کاهش می‌دهد. با این حال، همچنان باید نقاط پایانی JSONP را به داده‌های غیرحساس و فقط خواندنی محدود کنید، زیرا هر صفحه‌ای در وب می‌تواند نقطه پایانی JSONP شما را از طریق تگ `<script>` بارگذاری کند.
:::

## همچنین ببینید

- [رندرینگ XML/JSON/YAML/ProtoBuf](/en/docs/rendering/rendering/)
- [SecureJSON](/en/docs/rendering/secure-json/)
- [AsciiJSON](/en/docs/rendering/ascii-json/)
- [PureJSON](/en/docs/rendering/pure-json/)
