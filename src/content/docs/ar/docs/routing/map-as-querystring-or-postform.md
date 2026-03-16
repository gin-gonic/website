---
title: "Map كمعاملات سلسلة استعلام أو نموذج إرسال"
sidebar:
  order: 6
---

أحياناً تحتاج لاستقبال مجموعة من أزواج المفتاح-القيمة حيث المفاتيح غير معروفة مسبقاً — على سبيل المثال، مرشحات ديناميكية أو بيانات وصفية معرّفة من المستخدم. يوفر Gin `c.QueryMap` و`c.PostFormMap` لتحليل معاملات ترميز الأقواس (مثل `ids[a]=1234`) إلى `map[string]string`.

- `c.QueryMap("key")` — يحلل أزواج `key[subkey]=value` من سلسلة استعلام URL.
- `c.PostFormMap("key")` — يحلل أزواج `key[subkey]=value` من جسم الطلب.

```go
package main

import (
  "fmt"
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.POST("/post", func(c *gin.Context) {
    ids := c.QueryMap("ids")
    names := c.PostFormMap("names")

    fmt.Printf("ids: %v; names: %v\n", ids, names)
    c.JSON(http.StatusOK, gin.H{
      "ids":   ids,
      "names": names,
    })
  })

  router.Run(":8080")
}
```

## اختبره

```sh
curl -X POST "http://localhost:8080/post?ids[a]=1234&ids[b]=hello" \
  -d "names[first]=thinkerou&names[second]=tianou"
# Output: {"ids":{"a":"1234","b":"hello"},"names":{"first":"thinkerou","second":"tianou"}}
```

:::note
ترميز الأقواس `ids[a]=1234` هو اصطلاح شائع. يحلل Gin الجزء داخل الأقواس كمفتاح للخريطة. يُدعم فقط مستوى واحد من الأقواس — الأقواس المتداخلة مثل `ids[a][b]=value` لا تُحلل كخرائط متداخلة.
:::

## انظر أيضاً

- [معاملات سلسلة الاستعلام](/ar/docs/routing/querystring-param/)
- [الاستعلام ونموذج الإرسال](/ar/docs/routing/query-and-post-form/)
