---
title: "Yol parametreleri"
sidebar:
  order: 2
---

Gin, URL'den doğrudan değer yakalamanıza olanak tanıyan iki tür yol parametresini destekler:

- **`:name`** — tek bir yol segmentini eşleştirir. Örneğin, `/user/:name` `/user/john` ile eşleşir ancak `/user/` veya `/user` ile eşleş**mez**.
- **`*action`** — önekten sonraki her şeyi, eğik çizgiler dahil, eşleştirir. Örneğin, `/user/:name/*action` `/user/john/send` ve `/user/john/` ile eşleşir. Yakalanan değer baştaki `/` karakterini içerir.

Handler'ınız içinde bir yol parametresinin değerini almak için `c.Param("name")` kullanın.

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

## Test et

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
Joker karakter `*action` değeri her zaman baştaki `/` karakterini içerir. Yukarıdaki örnekte, `c.Param("action")` `send` değil `/send` döndürür.
:::

:::caution
Aynı yol derinliğinde çakışıyorlarsa hem `/user/:name` hem de `/user/:name/*action` tanımlayamazsınız. Gin, belirsiz rotalar algılarsa başlatma sırasında panic oluşturur.
:::

## Ayrıca bakınız

- [Sorgu dizesi parametreleri](/tr/docs/routing/querystring-param/)
- [Sorgu ve post formu](/tr/docs/routing/query-and-post-form/)
