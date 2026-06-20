---
title: "معاملات سلسلة الاستعلام"
sidebar:
  order: 3
---

معاملات سلسلة الاستعلام هي أزواج المفتاح-القيمة التي تظهر بعد `?` في عنوان URL (على سبيل المثال، `/search?q=gin&page=2`). يوفر Gin طريقتين لقراءتها:

- `c.Query("key")` تُرجع قيمة معامل الاستعلام، أو **سلسلة فارغة** إذا لم يكن المفتاح موجوداً.
- `c.DefaultQuery("key", "default")` تُرجع القيمة، أو **القيمة الافتراضية** المحددة إذا لم يكن المفتاح موجوداً.

كلتا الطريقتين هما اختصارات للوصول إلى `c.Request.URL.Query()` مع كود أقل تكراراً.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  // Query string parameters are parsed using the existing underlying request object.
  // The request responds to a url matching:  /welcome?firstname=Jane&lastname=Doe
  router.GET("/welcome", func(c *gin.Context) {
    firstname := c.DefaultQuery("firstname", "Guest")
    lastname := c.Query("lastname") // shortcut for c.Request.URL.Query().Get("lastname")

    c.String(http.StatusOK, "Hello %s %s", firstname, lastname)
  })
  router.Run(":8080")
}
```

## اختبره

```sh
# Both parameters provided
curl "http://localhost:8080/welcome?firstname=Jane&lastname=Doe"
# Output: Hello Jane Doe

# Missing firstname -- uses default value "Guest"
curl "http://localhost:8080/welcome?lastname=Doe"
# Output: Hello Guest Doe

# No parameters at all
curl "http://localhost:8080/welcome"
# Output: Hello Guest
```

## انظر أيضاً

- [المعاملات في المسار](/ar/docs/routing/param-in-path/)
