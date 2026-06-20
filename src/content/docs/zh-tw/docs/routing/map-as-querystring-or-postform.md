---
title: "Map 作為查詢字串或 POST 表單參數"
sidebar:
  order: 6
---

有時你需要接收一組鍵值對，其中的鍵事先未知——例如動態篩選器或使用者自訂的中繼資料。Gin 提供 `c.QueryMap` 和 `c.PostFormMap` 來將方括號表示法的參數（如 `ids[a]=1234`）解析為 `map[string]string`。

- `c.QueryMap("key")` —— 從 URL 查詢字串中解析 `key[subkey]=value` 對。
- `c.PostFormMap("key")` —— 從請求主體中解析 `key[subkey]=value` 對。

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

## 測試

```sh
curl -X POST "http://localhost:8080/post?ids[a]=1234&ids[b]=hello" \
  -d "names[first]=thinkerou&names[second]=tianou"
# Output: {"ids":{"a":"1234","b":"hello"},"names":{"first":"thinkerou","second":"tianou"}}
```

:::note
方括號表示法 `ids[a]=1234` 是一種常見慣例。Gin 會將方括號內的部分解析為 map 的鍵。僅支援單層方括號——巢狀方括號如 `ids[a][b]=value` 不會被解析為巢狀 map。
:::

## 另請參閱

- [查詢字串參數](/zh-tw/docs/routing/querystring-param/)
- [查詢與 POST 表單](/zh-tw/docs/routing/query-and-post-form/)
