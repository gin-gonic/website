---
title: "マップとしてのクエリ文字列またはポストフォームパラメータ"
sidebar:
  order: 6
---

キーが事前にわからないキーバリューペアのセットを受け取る必要がある場合があります。例えば、動的フィルターやユーザー定義のメタデータなどです。Ginは `c.QueryMap` と `c.PostFormMap` を提供しており、ブラケット表記のパラメータ（`ids[a]=1234` など）を `map[string]string` にパースします。

- `c.QueryMap("key")` -- URLクエリ文字列から `key[subkey]=value` のペアをパースします。
- `c.PostFormMap("key")` -- リクエストボディから `key[subkey]=value` のペアをパースします。

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

## テスト

```sh
curl -X POST "http://localhost:8080/post?ids[a]=1234&ids[b]=hello" \
  -d "names[first]=thinkerou&names[second]=tianou"
# Output: {"ids":{"a":"1234","b":"hello"},"names":{"first":"thinkerou","second":"tianou"}}
```

:::note
ブラケット表記 `ids[a]=1234` は一般的な慣例です。Ginはブラケット内の部分をマップキーとしてパースします。単一レベルのブラケットのみがサポートされています。`ids[a][b]=value` のようなネストされたブラケットは、ネストされたマップとしてパースされません。
:::

## 関連項目

- [クエリ文字列パラメータ](/ja/docs/routing/querystring-param/)
- [クエリとポストフォーム](/ja/docs/routing/query-and-post-form/)
