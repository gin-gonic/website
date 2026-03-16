---
title: "Bind Uri"
sidebar:
  order: 7
---

`ShouldBindUri` vincula parâmetros de caminho URI diretamente em uma struct usando tags de struct `uri`. Combinado com tags de validação `binding`, isso permite validar parâmetros de caminho (como exigir um UUID válido) com uma única chamada.

Isso é útil quando sua rota contém dados estruturados — como IDs de recursos ou slugs — que você deseja validar e verificar o tipo antes de usar.

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

## Teste

```sh
# Valid UUID -- binding succeeds
curl http://localhost:8088/thinkerou/987fbc97-4bed-5078-9f07-9141ba07c9f3
# Output: {"name":"thinkerou","uuid":"987fbc97-4bed-5078-9f07-9141ba07c9f3"}

# Invalid UUID -- binding fails with validation error
curl http://localhost:8088/thinkerou/not-uuid
# Output: {"error":"Key: 'Person.ID' Error:Field validation for 'ID' failed on the 'uuid' tag"}
```

:::note
O nome da tag de struct `uri` deve corresponder ao nome do parâmetro na definição da rota. Por exemplo, `:id` na rota corresponde a `uri:"id"` na struct.
:::

## Veja também

- [Parâmetros no caminho](/pt/docs/routing/param-in-path/)
- [Binding e validação](/pt/docs/binding/binding-and-validation/)
