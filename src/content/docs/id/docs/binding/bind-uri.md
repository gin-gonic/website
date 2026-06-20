---
title: "Bind URI"
sidebar:
  order: 7
---

`ShouldBindUri` melakukan bind parameter path URI langsung ke struct menggunakan tag struct `uri`. Dikombinasikan dengan tag validasi `binding`, ini memungkinkan Anda memvalidasi parameter path (seperti memerlukan UUID yang valid) dengan satu panggilan.

Ini berguna ketika route Anda berisi data terstruktur — seperti ID resource atau slug — yang ingin Anda validasi dan periksa tipenya sebelum digunakan.

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

## Uji coba

```sh
# Valid UUID -- binding succeeds
curl http://localhost:8088/thinkerou/987fbc97-4bed-5078-9f07-9141ba07c9f3
# Output: {"name":"thinkerou","uuid":"987fbc97-4bed-5078-9f07-9141ba07c9f3"}

# Invalid UUID -- binding fails with validation error
curl http://localhost:8088/thinkerou/not-uuid
# Output: {"error":"Key: 'Person.ID' Error:Field validation for 'ID' failed on the 'uuid' tag"}
```

:::note
Nama tag struct `uri` harus sesuai dengan nama parameter di definisi route. Misalnya, `:id` di route sesuai dengan `uri:"id"` di struct.
:::

## Lihat juga

- [Parameter di path](/id/docs/routing/param-in-path/)
- [Binding dan validasi](/id/docs/binding/binding-and-validation/)
