---
title: "Formato de colección para arrays"
---

Puedes controlar cómo Gin divide los valores de lista para campos slice/array usando la etiqueta de estructura `collection_format` con el enlace de formularios.

Formatos soportados (v1.11+):

- multi (predeterminado): claves repetidas o valores separados por comas
- csv: valores separados por comas
- ssv: valores separados por espacios
- tsv: valores separados por tabulaciones
- pipes: valores separados por barras verticales

Ejemplo:

```go
package main

import (
  "net/http"
  "github.com/gin-gonic/gin"
)

type Filters struct {
  Tags      []string `form:"tags" collection_format:"csv"`     // /search?tags=go,web,api
  Labels    []string `form:"labels" collection_format:"multi"` // /search?labels=bug&labels=helpwanted
  IdsSSV    []int    `form:"ids_ssv" collection_format:"ssv"`  // /search?ids_ssv=1 2 3
  IdsTSV    []int    `form:"ids_tsv" collection_format:"tsv"`  // /search?ids_tsv=1\t2\t3
  Levels    []int    `form:"levels" collection_format:"pipes"` // /search?levels=1|2|3
}

func main() {
  r := gin.Default()
  r.GET("/search", func(c *gin.Context) {
    var f Filters
    if err := c.ShouldBind(&f); err != nil {
      c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      return
    }
    c.JSON(http.StatusOK, f)
  })
  r.Run(":8080")
}
```

Valores predeterminados para colecciones (v1.11+):

- Usa `default` en la etiqueta `form` para establecer valores de respaldo.
- Para `multi` y `csv`, separa los valores predeterminados con punto y coma: `default=1;2;3`.
- Para `ssv`, `tsv` y `pipes`, usa el separador natural en el valor predeterminado.

Ver también: ejemplo "Enlazar valores predeterminados para campos de formulario".
