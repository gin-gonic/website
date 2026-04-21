---
title: "Map sebagai parameter querystring atau postform"
sidebar:
  order: 6
---

Terkadang Anda perlu menerima sekumpulan pasangan kunci-nilai dengan kunci yang tidak diketahui sebelumnya — misalnya, filter dinamis atau metadata yang ditentukan pengguna. Gin menyediakan `c.QueryMap` dan `c.PostFormMap` untuk melakukan parse parameter notasi braket (seperti `ids[a]=1234`) menjadi `map[string]string`.

- `c.QueryMap("key")` — melakukan parse pasangan `key[subkey]=value` dari query string URL.
- `c.PostFormMap("key")` — melakukan parse pasangan `key[subkey]=value` dari body permintaan.

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
Notasi braket `ids[a]=1234` adalah konvensi umum. Gin melakukan parse bagian di dalam braket sebagai kunci map. Hanya braket satu tingkat yang didukung — braket bersarang seperti `ids[a][b]=value` tidak dilakukan parsing sebagai map bersarang.
:::

## Lihat juga

- [Parameter query string](/id/docs/routing/querystring-param/)
- [Query dan post form](/id/docs/routing/query-and-post-form/)
