---
title: "Sorgu ve post formu"
sidebar:
  order: 5
---

Bir `POST` isteğini işlerken, genellikle hem URL sorgu dizesinden hem de istek gövdesinden değerleri okumanız gerekir. Gin bu iki kaynağı ayrı tutar, böylece her birine bağımsız olarak erişebilirsiniz:

- `c.Query("key")` / `c.DefaultQuery("key", "default")` — URL sorgu dizesinden okur.
- `c.PostForm("key")` / `c.DefaultPostForm("key", "default")` — `application/x-www-form-urlencoded` veya `multipart/form-data` istek gövdesinden okur.

Bu, rotanın kaynağı sorgu parametreleriyle (`id` gibi) tanımladığı ve gövdenin yükü (`name` ve `message` gibi) taşıdığı REST API'lerinde yaygındır.

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
    id := c.Query("id")
    page := c.DefaultQuery("page", "0")
    name := c.PostForm("name")
    message := c.PostForm("message")

    fmt.Printf("id: %s; page: %s; name: %s; message: %s\n", id, page, name, message)
    c.String(http.StatusOK, "id: %s; page: %s; name: %s; message: %s", id, page, name, message)
  })

  router.Run(":8080")
}
```

## Test et

```sh
# Query params in URL, form data in body
curl -X POST "http://localhost:8080/post?id=1234&page=1" \
  -d "name=manu&message=this_is_great"
# Output: id: 1234; page: 1; name: manu; message: this_is_great

# Missing page -- falls back to default value "0"
curl -X POST "http://localhost:8080/post?id=1234" \
  -d "name=manu&message=hello"
# Output: id: 1234; page: 0; name: manu; message: hello
```

:::note
`c.Query` yalnızca URL sorgu dizesinden okur ve `c.PostForm` yalnızca istek gövdesinden okur. Birbirleriyle asla çakışmazlar. Gin'in her iki kaynağı da otomatik olarak kontrol etmesini istiyorsanız, bunun yerine bir struct ile `c.ShouldBind` kullanın.
:::

## Ayrıca bakınız

- [Sorgu dizesi parametreleri](/tr/docs/routing/querystring-param/)
- [Sorgu dizesi veya postform parametreleri olarak map](/tr/docs/routing/map-as-querystring-or-postform/)
- [Multipart/Urlencoded form](/tr/docs/routing/multipart-urlencoded-form/)
