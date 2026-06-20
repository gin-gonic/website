---
title: "クエリ文字列パラメータ"
sidebar:
  order: 3
---

クエリ文字列パラメータは、URL内の `?` の後に表示されるキーバリューペアです（例：`/search?q=gin&page=2`）。Ginはこれらを読み取るための2つのメソッドを提供しています：

- `c.Query("key")` はクエリパラメータの値を返します。キーが存在しない場合は**空文字列**を返します。
- `c.DefaultQuery("key", "default")` は値を返します。キーが存在しない場合は指定された**デフォルト値**を返します。

どちらのメソッドも、より少ないボイラープレートで `c.Request.URL.Query()` にアクセスするためのショートカットです。

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  // Query string parameters are parsed using the existing underlying request object.
  // The request responds to a url matching:  /welcome?firstname=Jane&lastname=Doe
  router.GET("/welcome", func(c *gin.Context) {
    firstname := c.DefaultQuery("firstname", "Guest")
    lastname := c.Query("lastname") // shortcut for c.Request.URL.Query().Get("lastname")

    c.String(http.StatusOK, "Hello %s %s", firstname, lastname)
  })
  router.Run(":8080")
}
```

## テスト

```sh
# Both parameters provided
curl "http://localhost:8080/welcome?firstname=Jane&lastname=Doe"
# Output: Hello Jane Doe

# Missing firstname -- uses default value "Guest"
curl "http://localhost:8080/welcome?lastname=Doe"
# Output: Hello Guest Doe

# No parameters at all
curl "http://localhost:8080/welcome"
# Output: Hello Guest
```

## 関連項目

- [パス内のパラメータ](/ja/docs/routing/param-in-path/)
