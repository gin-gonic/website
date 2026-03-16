---
title: "Map sebagai parameter querystring atau postform"
sidebar:
  order: 6
---

Terkadang Anda perlu menerima sekumpulan pasangan kunci-nilai di mana kunci tidak diketahui sebelumnya — misalnya, filter dinamis atau metadata yang ditentukan pengguna. Gin menyediakan `c.QueryMap` dan `c.PostFormMap` untuk mem-parse parameter notasi bracket (seperti `ids[a]=1234`) menjadi `map[string]string`.

- `c.QueryMap("key")` — mem-parse pasangan `key[subkey]=value` dari query string URL.
- `c.PostFormMap("key")` — mem-parse pasangan `key[subkey]=value` dari body request.

```go
package main

import (
  "fmt"
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.POST("/post", func(c *gin.Context) {
    ids := c.QueryMap("ids")
    names := c.PostFormMap("names")

    fmt.Printf("ids: %v; names: %v\n", ids, names)
    c.JSON(http.StatusOK, gin.H{
      "ids":   ids,
      "names": names,
    })
  })

  router.Run(":8080")
}
```

## Uji coba

```sh
curl -X POST "http://localhost:8080/post?ids[a]=1234&ids[b]=hello" \
  -d "names[first]=thinkerou&names[second]=tianou"
# Output: {"ids":{"a":"1234","b":"hello"},"names":{"first":"thinkerou","second":"tianou"}}
```

:::note
Notasi bracket `ids[a]=1234` adalah konvensi umum. Gin mem-parse bagian di dalam bracket sebagai kunci map. Hanya bracket satu tingkat yang didukung — bracket bersarang seperti `ids[a][b]=value` tidak diparsing sebagai map bersarang.
:::

## Lihat juga

- [Parameter query string](/id/docs/routing/querystring-param/)
- [Query dan post form](/id/docs/routing/query-and-post-form/)
