---
title: "Bind Uri"
sidebar:
  order: 7
---

`ShouldBindUri` binds URI path parameters directly into a struct using `uri` struct tags. Combined with `binding` validation tags, this lets you validate path parameters (such as requiring a valid UUID) with a single call.

This is useful when your route contains structured data — like resource IDs or slugs — that you want to validate and type-check before using.

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

## Test it

```sh
# Valid UUID -- binding succeeds
curl http://localhost:8088/thinkerou/987fbc97-4bed-5078-9f07-9141ba07c9f3
# Output: {"name":"thinkerou","uuid":"987fbc97-4bed-5078-9f07-9141ba07c9f3"}

# Invalid UUID -- binding fails with validation error
curl http://localhost:8088/thinkerou/not-uuid
# Output: {"error":"Key: 'Person.ID' Error:Field validation for 'ID' failed on the 'uuid' tag"}
```

:::note
The `uri` struct tag name must match the parameter name in the route definition. For example, `:id` in the route corresponds to `uri:"id"` in the struct.
:::

## See also

- [Parameters in path](/en/docs/routing/param-in-path/)
- [Binding and validation](/en/docs/binding/binding-and-validation/)
