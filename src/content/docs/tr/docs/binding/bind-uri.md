---
title: "URI bağlama"
sidebar:
  order: 7
---

`ShouldBindUri`, `uri` struct etiketlerini kullanarak URI yol parametrelerini doğrudan bir struct'a bağlar. `binding` doğrulama etiketleriyle birlikte kullanıldığında, yol parametrelerini (geçerli bir UUID gerektirmek gibi) tek bir çağrıyla doğrulamanıza olanak tanır.

Bu, rotanız yapılandırılmış veri içerdiğinde — kaynak kimlikleri veya slug'lar gibi — kullanmadan önce doğrulamak ve tür kontrolü yapmak istediğinizde kullanışlıdır.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

type Person struct {
  ID   string `uri:"id" binding:"required,uuid"`
  Name string `uri:"name" binding:"required"`
}

func main() {
  route := gin.Default()

  route.GET("/:name/:id", func(c *gin.Context) {
    var person Person
    if err := c.ShouldBindUri(&person); err != nil {
      c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      return
    }
    c.JSON(http.StatusOK, gin.H{"name": person.Name, "uuid": person.ID})
  })

  route.Run(":8088")
}
```

## Test et

```sh
# Valid UUID -- binding succeeds
curl http://localhost:8088/thinkerou/987fbc97-4bed-5078-9f07-9141ba07c9f3
# Output: {"name":"thinkerou","uuid":"987fbc97-4bed-5078-9f07-9141ba07c9f3"}

# Invalid UUID -- binding fails with validation error
curl http://localhost:8088/thinkerou/not-uuid
# Output: {"error":"Key: 'Person.ID' Error:Field validation for 'ID' failed on the 'uuid' tag"}
```

:::note
`uri` struct etiket adı, rota tanımındaki parametre adıyla eşleşmelidir. Örneğin, rotadaki `:id` struct'taki `uri:"id"` ile karşılık gelir.
:::

## Ayrıca bakınız

- [Yol parametreleri](/tr/docs/routing/param-in-path/)
- [Bağlama ve doğrulama](/tr/docs/binding/binding-and-validation/)
