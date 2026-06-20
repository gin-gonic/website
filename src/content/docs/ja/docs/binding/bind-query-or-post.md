---
title: "クエリ文字列またはポストデータのバインド"
sidebar:
  order: 4
---

`ShouldBind` はHTTPメソッドと `Content-Type` ヘッダーに基づいて、自動的にバインディングエンジンを選択します：

- **GET** リクエストの場合、クエリ文字列バインディング（`form` タグ）を使用します。
- **POST/PUT** リクエストの場合、`Content-Type` を確認し、`application/json` にはJSONバインディング、`application/xml` にはXMLバインディング、`application/x-www-form-urlencoded` または `multipart/form-data` にはフォームバインディングを使用します。

これにより、単一のハンドラがクエリ文字列とリクエストボディの両方からデータを受け取ることができ、ソースの手動選択が不要になります。

```go
package main

import (
  "log"
  "net/http"
  "time"

  "github.com/gin-gonic/gin"
)

type Person struct {
  Name     string    `form:"name"`
  Address  string    `form:"address"`
  Birthday time.Time `form:"birthday" time_format:"2006-01-02" time_utc:"1"`
}

func main() {
  route := gin.Default()
  route.GET("/testing", startPage)
  route.POST("/testing", startPage)
  route.Run(":8085")
}

func startPage(c *gin.Context) {
  var person Person
  if err := c.ShouldBind(&person); err != nil {
    c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
    return
  }

  log.Printf("Name: %s, Address: %s, Birthday: %s\n", person.Name, person.Address, person.Birthday)
  c.JSON(http.StatusOK, gin.H{
    "name":     person.Name,
    "address":  person.Address,
    "birthday": person.Birthday,
  })
}
```

## テスト

```sh
# GET with query string parameters
curl "http://localhost:8085/testing?name=appleboy&address=xyz&birthday=1992-03-15"
# Output: {"address":"xyz","birthday":"1992-03-15T00:00:00Z","name":"appleboy"}

# POST with form data
curl -X POST http://localhost:8085/testing \
  -d "name=appleboy&address=xyz&birthday=1992-03-15"
# Output: {"address":"xyz","birthday":"1992-03-15T00:00:00Z","name":"appleboy"}

# POST with JSON body
curl -X POST http://localhost:8085/testing \
  -H "Content-Type: application/json" \
  -d '{"name":"appleboy","address":"xyz","birthday":"1992-03-15"}'
# Output: {"address":"xyz","birthday":"1992-03-15T00:00:00Z","name":"appleboy"}
```

:::note
`time_format` タグはGoの[リファレンスタイムレイアウト](https://pkg.go.dev/time#pkg-constants)を使用します。フォーマット `2006-01-02` は「年-月-日」を意味します。`time_utc:"1"` タグは、パースされた時刻がUTCであることを保証します。
:::

## 関連項目

- [バインドとバリデーション](/ja/docs/binding/binding-and-validation/)
- [クエリ文字列のみバインド](/ja/docs/binding/only-bind-query-string/)
- [ヘッダーのバインド](/ja/docs/binding/bind-header/)
