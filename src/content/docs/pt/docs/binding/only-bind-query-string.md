---
title: "Vincular apenas query string"
sidebar:
  order: 3
---

`ShouldBindQuery` vincula apenas os parâmetros de query string da URL a uma struct, ignorando completamente o corpo da requisição. Isso é útil quando você quer garantir que dados do corpo POST não sobrescrevam acidentalmente os parâmetros de query — por exemplo, em endpoints que aceitam tanto filtros de query quanto um corpo JSON.

Em contraste, `ShouldBind` em uma requisição GET também usa binding de query, mas em uma requisição POST ele verificará primeiro o corpo. Use `ShouldBindQuery` quando você quiser explicitamente vincular apenas a query, independentemente do método HTTP.

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

## Teste

```sh
# GET with query parameters
curl "http://localhost:8085/testing?name=appleboy&address=xyz"
# Output: {"address":"xyz","name":"appleboy"}

# POST with query parameters -- body is ignored, only query is bound
curl -X POST "http://localhost:8085/testing?name=appleboy&address=xyz" \
  -d "name=ignored&address=ignored"
# Output: {"address":"xyz","name":"appleboy"}
```

## Veja também

- [Vincular query string ou dados post](/pt/docs/binding/bind-query-or-post/)
- [Binding e validação](/pt/docs/binding/binding-and-validation/)
