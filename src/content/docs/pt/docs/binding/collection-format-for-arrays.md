---
title: "Formato de coleção para arrays"
sidebar:
  order: 6
---

Você pode controlar como o Gin divide valores de lista para campos de slice/array usando a tag de struct `collection_format` com binding de formulário.

Formatos suportados (v1.11+):

- multi (padrão): chaves repetidas ou valores separados por vírgula
- csv: valores separados por vírgula
- ssv: valores separados por espaço
- tsv: valores separados por tab
- pipes: valores separados por pipe

Exemplo:

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

Padrões para coleções (v1.11+):

- Use `default` na tag `form` para definir valores de fallback.
- Para `multi` e `csv`, separe valores padrão com ponto e vírgula: `default=1;2;3`.
- Para `ssv`, `tsv` e `pipes`, use o separador natural no padrão.

Veja também: exemplo "Valores padrão para campos de formulário".
