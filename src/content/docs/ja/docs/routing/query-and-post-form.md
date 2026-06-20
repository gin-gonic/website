---
title: "クエリとポストフォーム"
sidebar:
  order: 5
---

`POST` リクエストを処理する際、URLクエリ文字列とリクエストボディの両方から値を読み取る必要がよくあります。Ginはこれら2つのソースを分離しているため、それぞれ独立してアクセスできます：

- `c.Query("key")` / `c.DefaultQuery("key", "default")` -- URLクエリ文字列から読み取ります。
- `c.PostForm("key")` / `c.DefaultPostForm("key", "default")` -- `application/x-www-form-urlencoded` または `multipart/form-data` のリクエストボディから読み取ります。

これはREST APIで一般的なパターンで、ルートがクエリパラメータ（`id` など）でリソースを識別し、ボディがペイロード（`name` や `message` など）を運びます。

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
    id := c.Query("id")
    page := c.DefaultQuery("page", "0")
    name := c.PostForm("name")
    message := c.PostForm("message")

    fmt.Printf("id: %s; page: %s; name: %s; message: %s\n", id, page, name, message)
    c.String(http.StatusOK, "id: %s; page: %s; name: %s; message: %s", id, page, name, message)
  })

  router.Run(":8080")
}
```

## テスト

```sh
# Query params in URL, form data in body
curl -X POST "http://localhost:8080/post?id=1234&page=1" \
  -d "name=manu&message=this_is_great"
# Output: id: 1234; page: 1; name: manu; message: this_is_great

# Missing page -- falls back to default value "0"
curl -X POST "http://localhost:8080/post?id=1234" \
  -d "name=manu&message=hello"
# Output: id: 1234; page: 0; name: manu; message: hello
```

:::note
`c.Query` はURLクエリ文字列からのみ読み取り、`c.PostForm` はリクエストボディからのみ読み取ります。これらが交差することはありません。Ginに両方のソースを自動的に確認させたい場合は、構造体を使用した `c.ShouldBind` を代わりに使用してください。
:::

## 関連項目

- [クエリ文字列パラメータ](/ja/docs/routing/querystring-param/)
- [マップとしてのクエリ文字列またはポストフォームパラメータ](/ja/docs/routing/map-as-querystring-or-postform/)
- [Multipart/URLエンコードフォーム](/ja/docs/routing/multipart-urlencoded-form/)
