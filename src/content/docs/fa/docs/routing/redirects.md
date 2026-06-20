---
title: "تغییر مسیرها"
sidebar:
  order: 9
---

Gin هم تغییر مسیر HTTP (ارسال کلاینت به URL دیگر) و هم تغییر مسیر روتر (ارسال داخلی درخواست به handler دیگر بدون رفت و برگشت به کلاینت) را پشتیبانی می‌کند.

## تغییر مسیر HTTP

از `c.Redirect` با کد وضعیت HTTP مناسب برای تغییر مسیر کلاینت استفاده کنید:

- **301 (`http.StatusMovedPermanently`)** -- منبع به‌طور دائم جابجا شده است. مرورگرها و موتورهای جستجو حافظه‌های نهان خود را به‌روزرسانی می‌کنند.
- **302 (`http.StatusFound`)** -- تغییر مسیر موقت. مرورگر دنبال می‌کند اما URL جدید را ذخیره نمی‌کند.
- **307 (`http.StatusTemporaryRedirect`)** -- مانند 302، اما مرورگر باید متد HTTP اصلی را حفظ کند (مفید برای تغییر مسیرهای POST).
- **308 (`http.StatusPermanentRedirect`)** -- مانند 301، اما مرورگر باید متد HTTP اصلی را حفظ کند.

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

## تست

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
هنگام تغییر مسیر از یک handler POST، از `302` یا `307` به‌جای `301` استفاده کنید. تغییر مسیر `301` ممکن است باعث شود برخی مرورگرها متد را از POST به GET تغییر دهند که می‌تواند منجر به رفتار غیرمنتظره شود.
:::

:::tip
تغییر مسیرهای داخلی از طریق `router.HandleContext(c)` پاسخ تغییر مسیر به کلاینت ارسال نمی‌کنند. درخواست در داخل سرور مجدداً مسیریابی می‌شود که سریع‌تر است و برای کلاینت نامرئی است.
:::

## همچنین ببینید

- [گروه‌بندی مسیرها](/fa/docs/routing/grouping-routes/)
