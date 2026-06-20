---
title: "AsciiJSON"
sidebar:
  order: 4
---

`AsciiJSON` داده‌ها را به JSON سریال‌سازی می‌کند اما تمام کاراکترهای غیر ASCII را به توالی‌های فرار یونیکد `\uXXXX` تبدیل می‌کند. کاراکترهای خاص HTML مانند `<` و `>` نیز فرار داده می‌شوند. نتیجه یک بدنه پاسخ است که فقط شامل کاراکترهای ASCII 7 بیتی است.

**زمان استفاده از AsciiJSON:**

- مصرف‌کنندگان API شما نیاز به پاسخ‌های کاملاً ایمن ASCII دارند (مثلاً سیستم‌هایی که نمی‌توانند بایت‌های کدگذاری شده UTF-8 را مدیریت کنند).
- نیاز دارید JSON را در زمینه‌هایی که فقط ASCII پشتیبانی می‌کنند جاگذاری کنید، مانند برخی سیستم‌های لاگ‌گذاری یا انتقال‌های قدیمی.
- می‌خواهید مطمئن شوید کاراکترهایی مانند `<`، `>` و `&` فرار داده شده‌اند تا از مشکلات تزریق هنگام جاگذاری JSON در HTML جلوگیری شود.

برای اکثر APIهای مدرن، `c.JSON()` استاندارد کافی است زیرا UTF-8 معتبر خروجی می‌دهد. از `AsciiJSON` فقط زمانی استفاده کنید که ایمنی ASCII یک نیاز خاص است.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.GET("/someJSON", func(c *gin.Context) {
    data := map[string]interface{}{
      "lang": "GO语言",
      "tag":  "<br>",
    }

    // will output : {"lang":"GO\u8bed\u8a00","tag":"\u003cbr\u003e"}
    c.AsciiJSON(http.StatusOK, data)
  })

  // Listen and serve on 0.0.0.0:8080
  router.Run(":8080")
}
```

می‌توانید این نقطه پایانی را با curl تست کنید:

```bash
curl http://localhost:8080/someJSON
# Output: {"lang":"GO\u8bed\u8a00","tag":"\u003cbr\u003e"}
```

توجه کنید که کاراکترهای چینی `语言` با `\u8bed\u8a00` جایگزین شده‌اند و تگ `<br>` به `\u003cbr\u003e` تبدیل شده است. بدنه پاسخ برای مصرف در هر محیط فقط ASCII ایمن است.
