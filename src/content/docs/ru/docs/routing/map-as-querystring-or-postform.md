---
title: "Map как параметры строки запроса или POST-формы"
sidebar:
  order: 6
---

Иногда вам нужно получить набор пар ключ-значение, где ключи заранее неизвестны — например, динамические фильтры или пользовательские метаданные. Gin предоставляет `c.QueryMap` и `c.PostFormMap` для разбора параметров в нотации со скобками (например, `ids[a]=1234`) в `map[string]string`.

- `c.QueryMap("key")` — разбирает пары `key[subkey]=value` из строки запроса URL.
- `c.PostFormMap("key")` — разбирает пары `key[subkey]=value` из тела запроса.

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

## Тестирование

```sh
curl -X POST "http://localhost:8080/post?ids[a]=1234&ids[b]=hello" \
  -d "names[first]=thinkerou&names[second]=tianou"
# Output: {"ids":{"a":"1234","b":"hello"},"names":{"first":"thinkerou","second":"tianou"}}
```

:::note
Нотация со скобками `ids[a]=1234` — это распространённое соглашение. Gin разбирает часть внутри скобок как ключ карты. Поддерживаются только одноуровневые скобки — вложенные скобки вроде `ids[a][b]=value` не разбираются как вложенные карты.
:::

## Смотрите также

- [Параметры строки запроса](/ru/docs/routing/querystring-param/)
- [Запрос и POST-форма](/ru/docs/routing/query-and-post-form/)
