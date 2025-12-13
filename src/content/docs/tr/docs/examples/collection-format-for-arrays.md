---
title: "Diziler için koleksiyon formatı"
---

Form bağlama ile `collection_format` struct etiketi kullanarak Gin'in slice/array alanları için liste değerlerini nasıl böldüğünü kontrol edebilirsiniz.

Desteklenen formatlar (v1.11+):

- multi (varsayılan): tekrarlanan anahtarlar veya virgülle ayrılmış değerler
- csv: virgülle ayrılmış değerler
- ssv: boşlukla ayrılmış değerler
- tsv: sekmeyle ayrılmış değerler
- pipes: boru ile ayrılmış değerler

Örnek:

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

Koleksiyonlar için varsayılan değerler (v1.11+):

- Yedek değerler ayarlamak için `form` etiketinde `default` kullanın.
- `multi` ve `csv` için varsayılan değerleri noktalı virgülle ayırın: `default=1;2;3`.
- `ssv`, `tsv` ve `pipes` için varsayılan değerde doğal ayırıcıyı kullanın.

Ayrıca bakınız: "Form alanları için varsayılan değerleri bağlama" örneği.
