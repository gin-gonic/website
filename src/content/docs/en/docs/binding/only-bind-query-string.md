---
title: "Only bind query string"
sidebar:
  order: 3
---

`ShouldBindQuery` binds only the URL query string parameters to a struct, ignoring the request body entirely. This is useful when you want to ensure that POST body data does not accidentally overwrite query parameters — for example, in endpoints that accept both query filters and a JSON body.

In contrast, `ShouldBind` on a GET request also uses query binding, but on a POST request it will first check the body. Use `ShouldBindQuery` when you explicitly want query-only binding regardless of the HTTP method.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

type Person struct {
  Name    string `form:"name"`
  Address string `form:"address"`
}

func main() {
  route := gin.Default()
  route.Any("/testing", startPage)
  route.Run(":8085")
}

func startPage(c *gin.Context) {
  var person Person
  if err := c.ShouldBindQuery(&person); err != nil {
    c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
    return
  }

  c.JSON(http.StatusOK, gin.H{
    "name":    person.Name,
    "address": person.Address,
  })
}
```

## Test it

```sh
# GET with query parameters
curl "http://localhost:8085/testing?name=appleboy&address=xyz"
# Output: {"address":"xyz","name":"appleboy"}

# POST with query parameters -- body is ignored, only query is bound
curl -X POST "http://localhost:8085/testing?name=appleboy&address=xyz" \
  -d "name=ignored&address=ignored"
# Output: {"address":"xyz","name":"appleboy"}
```

## See also

- [Bind query string or post data](/en/docs/binding/bind-query-or-post/)
- [Binding and validation](/en/docs/binding/binding-and-validation/)
