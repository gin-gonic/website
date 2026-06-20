---
title: "Format koleksi untuk array"
sidebar:
  order: 6
---

Anda dapat mengontrol bagaimana Gin memisahkan nilai list untuk field slice/array menggunakan tag struct `collection_format` dengan binding form.

Format yang didukung (v1.11+):

- multi (default): kunci berulang atau nilai dipisahkan koma
- csv: nilai dipisahkan koma
- ssv: nilai dipisahkan spasi
- tsv: nilai dipisahkan tab
- pipes: nilai dipisahkan pipe

Contoh:

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

Default untuk koleksi (v1.11+):

- Gunakan `default` dalam tag `form` untuk menetapkan nilai fallback.
- Untuk `multi` dan `csv`, pisahkan nilai default dengan titik koma: `default=1;2;3`.
- Untuk `ssv`, `tsv`, dan `pipes`, gunakan pemisah alami dalam default.

Lihat juga: contoh "Bind nilai default untuk field form".
