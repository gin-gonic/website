---
title: "Solo enlazar cadena de consulta"
sidebar:
  order: 3
---

`ShouldBindQuery` enlaza solo los parámetros de cadena de consulta de la URL a un struct, ignorando completamente el cuerpo de la solicitud. Esto es útil cuando quieres asegurarte de que los datos del cuerpo POST no sobrescriban accidentalmente los parámetros de consulta — por ejemplo, en endpoints que aceptan tanto filtros de consulta como un cuerpo JSON.

En contraste, `ShouldBind` en una solicitud GET también usa el enlace de consulta, pero en una solicitud POST verificará primero el cuerpo. Usa `ShouldBindQuery` cuando quieras explícitamente enlazar solo la consulta independientemente del método HTTP.

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

## Pruébalo

```sh
# GET with query parameters
curl "http://localhost:8085/testing?name=appleboy&address=xyz"
# Output: {"address":"xyz","name":"appleboy"}

# POST with query parameters -- body is ignored, only query is bound
curl -X POST "http://localhost:8085/testing?name=appleboy&address=xyz" \
  -d "name=ignored&address=ignored"
# Output: {"address":"xyz","name":"appleboy"}
```

## Ver también

- [Enlazar cadena de consulta o datos post](/es/docs/binding/bind-query-or-post/)
- [Enlace y validación](/es/docs/binding/binding-and-validation/)
