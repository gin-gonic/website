---
title: "Enlazar URI"
sidebar:
  order: 7
---

`ShouldBindUri` enlaza los parámetros de ruta URI directamente en un struct usando etiquetas de struct `uri`. Combinado con etiquetas de validación `binding`, esto te permite validar parámetros de ruta (como requerir un UUID válido) con una sola llamada.

Esto es útil cuando tu ruta contiene datos estructurados — como IDs de recursos o slugs — que deseas validar y verificar el tipo antes de usar.

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

## Pruébalo

```sh
# Valid UUID -- binding succeeds
curl http://localhost:8088/thinkerou/987fbc97-4bed-5078-9f07-9141ba07c9f3
# Output: {"name":"thinkerou","uuid":"987fbc97-4bed-5078-9f07-9141ba07c9f3"}

# Invalid UUID -- binding fails with validation error
curl http://localhost:8088/thinkerou/not-uuid
# Output: {"error":"Key: 'Person.ID' Error:Field validation for 'ID' failed on the 'uuid' tag"}
```

:::note
El nombre de la etiqueta de struct `uri` debe coincidir con el nombre del parámetro en la definición de la ruta. Por ejemplo, `:id` en la ruta corresponde a `uri:"id"` en el struct.
:::

## Ver también

- [Parámetros en la ruta](/es/docs/routing/param-in-path/)
- [Enlace y validación](/es/docs/binding/binding-and-validation/)
