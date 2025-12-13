---
title: "Collection format for arrays"
---

You can control how Gin splits list values for slice/array fields using the `collection_format` struct tag with form binding.

Supported formats (v1.11+):

- multi (default): repeated keys or comma-separated values
- csv: comma-separated values
- ssv: space-separated values
- tsv: tab-separated values
- pipes: pipe-separated values

Example:

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

Defaults for collections (v1.11+):

- Use `default` in the `form` tag to set fallback values.
- For `multi` and `csv`, separate default values with semicolons: `default=1;2;3`.
- For `ssv`, `tsv`, and `pipes`, use the natural separator in the default.

See also: "Bind default values for form fields" example.
