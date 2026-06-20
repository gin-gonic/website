---
title: "Map como parâmetros de querystring ou postform"
sidebar:
  order: 6
---

Às vezes você precisa receber um conjunto de pares chave-valor onde as chaves não são conhecidas antecipadamente — por exemplo, filtros dinâmicos ou metadados definidos pelo usuário. O Gin fornece `c.QueryMap` e `c.PostFormMap` para analisar parâmetros com notação de colchetes (como `ids[a]=1234`) em um `map[string]string`.

- `c.QueryMap("key")` — analisa pares `key[subkey]=value` da query string da URL.
- `c.PostFormMap("key")` — analisa pares `key[subkey]=value` do corpo da requisição.

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

## Teste

```sh
curl -X POST "http://localhost:8080/post?ids[a]=1234&ids[b]=hello" \
  -d "names[first]=thinkerou&names[second]=tianou"
# Output: {"ids":{"a":"1234","b":"hello"},"names":{"first":"thinkerou","second":"tianou"}}
```

:::note
A notação de colchetes `ids[a]=1234` é uma convenção comum. O Gin analisa a parte dentro dos colchetes como a chave do mapa. Apenas colchetes de nível único são suportados — colchetes aninhados como `ids[a][b]=value` não são analisados como mapas aninhados.
:::

## Veja também

- [Parâmetros de query string](/pt/docs/routing/querystring-param/)
- [Query e formulário post](/pt/docs/routing/query-and-post-form/)
