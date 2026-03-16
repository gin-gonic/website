---
title: "Map como parámetros de cadena de consulta o postform"
sidebar:
  order: 6
---

A veces necesitas recibir un conjunto de pares clave-valor donde las claves no se conocen de antemano — por ejemplo, filtros dinámicos o metadatos definidos por el usuario. Gin proporciona `c.QueryMap` y `c.PostFormMap` para analizar parámetros con notación de corchetes (como `ids[a]=1234`) en un `map[string]string`.

- `c.QueryMap("key")` — analiza pares `key[subkey]=value` de la cadena de consulta de la URL.
- `c.PostFormMap("key")` — analiza pares `key[subkey]=value` del cuerpo de la solicitud.

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

## Pruébalo

```sh
curl -X POST "http://localhost:8080/post?ids[a]=1234&ids[b]=hello" \
  -d "names[first]=thinkerou&names[second]=tianou"
# Output: {"ids":{"a":"1234","b":"hello"},"names":{"first":"thinkerou","second":"tianou"}}
```

:::note
La notación de corchetes `ids[a]=1234` es una convención común. Gin analiza la porción dentro de los corchetes como la clave del map. Solo se admiten corchetes de un nivel — corchetes anidados como `ids[a][b]=value` no se analizan como maps anidados.
:::

## Ver también

- [Parámetros de cadena de consulta](/es/docs/routing/querystring-param/)
- [Consulta y formulario post](/es/docs/routing/query-and-post-form/)
