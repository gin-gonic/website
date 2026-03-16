---
title: "Sorgu dizesi veya postform parametreleri olarak map"
sidebar:
  order: 6
---

Bazen anahtarları önceden bilinmeyen bir anahtar-değer çifti kümesi almanız gerekebilir — örneğin, dinamik filtreler veya kullanıcı tanımlı meta veriler. Gin, köşeli parantez gösterimli parametreleri (`ids[a]=1234` gibi) bir `map[string]string`'e ayrıştırmak için `c.QueryMap` ve `c.PostFormMap` sağlar.

- `c.QueryMap("key")` — URL sorgu dizesinden `key[subkey]=value` çiftlerini ayrıştırır.
- `c.PostFormMap("key")` — istek gövdesinden `key[subkey]=value` çiftlerini ayrıştırır.

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

## Test et

```sh
curl -X POST "http://localhost:8080/post?ids[a]=1234&ids[b]=hello" \
  -d "names[first]=thinkerou&names[second]=tianou"
# Output: {"ids":{"a":"1234","b":"hello"},"names":{"first":"thinkerou","second":"tianou"}}
```

:::note
Köşeli parantez gösterimi `ids[a]=1234` yaygın bir kuraldır. Gin, parantez içindeki kısmı map anahtarı olarak ayrıştırır. Yalnızca tek seviye parantez desteklenir — `ids[a][b]=value` gibi iç içe parantezler iç içe map'ler olarak ayrıştırılmaz.
:::

## Ayrıca bakınız

- [Sorgu dizesi parametreleri](/tr/docs/routing/querystring-param/)
- [Sorgu ve post formu](/tr/docs/routing/query-and-post-form/)
