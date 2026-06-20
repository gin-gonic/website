---
title: "Map as querystring or postform parameters"
sidebar:
  order: 6
---

Sometimes you need to receive a set of key-value pairs where the keys are not known in advance — for example, dynamic filters or user-defined metadata. Gin provides `c.QueryMap` and `c.PostFormMap` to parse bracket-notation parameters (like `ids[a]=1234`) into a `map[string]string`.

- `c.QueryMap("key")` — parses `key[subkey]=value` pairs from the URL query string.
- `c.PostFormMap("key")` — parses `key[subkey]=value` pairs from the request body.

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

## Test it

```sh
curl -X POST "http://localhost:8080/post?ids[a]=1234&ids[b]=hello" \
  -d "names[first]=thinkerou&names[second]=tianou"
# Output: {"ids":{"a":"1234","b":"hello"},"names":{"first":"thinkerou","second":"tianou"}}
```

:::note
The bracket notation `ids[a]=1234` is a common convention. Gin parses the portion inside brackets as the map key. Only single-level brackets are supported — nested brackets like `ids[a][b]=value` are not parsed as nested maps.
:::

## See also

- [Query string parameters](/en/docs/routing/querystring-param/)
- [Query and post form](/en/docs/routing/query-and-post-form/)
