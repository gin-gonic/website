---
title: "إعادة التوجيه"
sidebar:
  order: 9
---

يدعم Gin كلاً من إعادة توجيه HTTP (إرسال العميل إلى عنوان URL مختلف) وإعادة توجيه الموجّه (إعادة توجيه الطلب داخلياً إلى معالج مختلف دون رحلة ذهاب وإياب إلى العميل).

## إعادة توجيه HTTP

استخدم `c.Redirect` مع رمز حالة HTTP مناسب لإعادة توجيه العميل:

- **301 (`http.StatusMovedPermanently`)** — المورد انتقل بشكل دائم. تحدّث المتصفحات ومحركات البحث ذاكرتها المؤقتة.
- **302 (`http.StatusFound`)** — إعادة توجيه مؤقتة. يتبع المتصفح لكن لا يخزّن العنوان الجديد مؤقتاً.
- **307 (`http.StatusTemporaryRedirect`)** — مثل 302، لكن يجب على المتصفح الحفاظ على طريقة HTTP الأصلية (مفيد لإعادة توجيه POST).
- **308 (`http.StatusPermanentRedirect`)** — مثل 301، لكن يجب على المتصفح الحفاظ على طريقة HTTP الأصلية.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  // External redirect (GET)
  router.GET("/old", func(c *gin.Context) {
    c.Redirect(http.StatusMovedPermanently, "https://www.google.com/")
  })

  // Redirect from POST -- use 302 or 307 to preserve behavior
  router.POST("/submit", func(c *gin.Context) {
    c.Redirect(http.StatusFound, "/result")
  })

  // Internal router redirect (no HTTP round-trip)
  router.GET("/test", func(c *gin.Context) {
    c.Request.URL.Path = "/final"
    router.HandleContext(c)
  })

  router.GET("/final", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{"hello": "world"})
  })

  router.GET("/result", func(c *gin.Context) {
    c.String(http.StatusOK, "Redirected here!")
  })

  router.Run(":8080")
}
```

## اختبره

```sh
# GET redirect -- follows to Google (use -L to follow, -I to see headers only)
curl -I http://localhost:8080/old
# Output includes: HTTP/1.1 301 Moved Permanently
# Output includes: Location: https://www.google.com/

# POST redirect -- returns 302 with new location
curl -X POST -I http://localhost:8080/submit
# Output includes: HTTP/1.1 302 Found
# Output includes: Location: /result

# Internal redirect -- handled server-side, client sees final response
curl http://localhost:8080/test
# Output: {"hello":"world"}
```

:::caution
عند إعادة التوجيه من معالج POST، استخدم `302` أو `307` بدلاً من `301`. إعادة التوجيه `301` قد تتسبب في تغيير بعض المتصفحات للطريقة من POST إلى GET، مما قد يؤدي إلى سلوك غير متوقع.
:::

:::tip
إعادة التوجيه الداخلية عبر `router.HandleContext(c)` لا تُرسل استجابة إعادة توجيه إلى العميل. يُعاد توجيه الطلب داخل الخادم، وهو أسرع وغير مرئي للعميل.
:::

## انظر أيضاً

- [تجميع المسارات](/ar/docs/routing/grouping-routes/)
