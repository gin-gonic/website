---
title: "المعاملات في المسار"
sidebar:
  order: 2
---

يدعم Gin نوعين من معاملات المسار التي تتيح لك التقاط القيم مباشرة من عنوان URL:

- **`:name`** — يطابق جزءاً واحداً من المسار. على سبيل المثال، `/user/:name` يطابق `/user/john` لكنه **لا** يطابق `/user/` أو `/user`.
- **`*action`** — يطابق كل شيء بعد البادئة، بما في ذلك الشرطات المائلة. على سبيل المثال، `/user/:name/*action` يطابق `/user/john/send` و`/user/john/`. القيمة الملتقطة تتضمن `/` البادئة.

استخدم `c.Param("name")` لاسترجاع قيمة معامل المسار داخل المعالج.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  // This handler will match /user/john but will not match /user/ or /user
  router.GET("/user/:name", func(c *gin.Context) {
    name := c.Param("name")
    c.String(http.StatusOK, "Hello %s", name)
  })

  // However, this one will match /user/john/ and also /user/john/send
  // If no other routers match /user/john, it will redirect to /user/john/
  router.GET("/user/:name/*action", func(c *gin.Context) {
    name := c.Param("name")
    action := c.Param("action")
    message := name + " is " + action
    c.String(http.StatusOK, message)
  })

  router.Run(":8080")
}
```

## اختبره

```sh
# Single parameter -- matches :name
curl http://localhost:8080/user/john
# Output: Hello john

# Wildcard parameter -- matches :name and *action
curl http://localhost:8080/user/john/send
# Output: john is /send

# Trailing slash is captured by the wildcard
curl http://localhost:8080/user/john/
# Output: john is /
```

:::note
قيمة البدل `*action` تتضمن دائماً `/` البادئة. في المثال أعلاه، `c.Param("action")` تُرجع `/send` وليس `send`.
:::

:::caution
لا يمكنك تعريف كل من `/user/:name` و`/user/:name/*action` إذا تعارضتا على نفس عمق المسار. سيتوقف Gin عند بدء التشغيل إذا اكتشف مسارات غامضة.
:::

## انظر أيضاً

- [معاملات سلسلة الاستعلام](/ar/docs/routing/querystring-param/)
- [الاستعلام ونموذج الإرسال](/ar/docs/routing/query-and-post-form/)
