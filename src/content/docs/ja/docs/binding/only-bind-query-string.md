---
title: "クエリ文字列のみバインド"
sidebar:
  order: 3
---

`ShouldBindQuery` はURLクエリ文字列パラメータのみを構造体にバインドし、リクエストボディを完全に無視します。これは、POSTボディのデータがクエリパラメータを誤って上書きしないようにしたい場合に便利です。例えば、クエリフィルターとJSONボディの両方を受け付けるエンドポイントなどです。

一方、`ShouldBind` はGETリクエストではクエリバインディングも使用しますが、POSTリクエストでは最初にボディを確認します。HTTPメソッドに関係なく明示的にクエリのみのバインディングが必要な場合は、`ShouldBindQuery` を使用してください。

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

type Person struct {
  Name    string `form:"name"`
  Address string `form:"address"`
}

func main() {
  route := gin.Default()
  route.Any("/testing", startPage)
  route.Run(":8085")
}

func startPage(c *gin.Context) {
  var person Person
  if err := c.ShouldBindQuery(&person); err != nil {
    c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
    return
  }

  c.JSON(http.StatusOK, gin.H{
    "name":    person.Name,
    "address": person.Address,
  })
}
```

## テスト

```sh
# GET with query parameters
curl "http://localhost:8085/testing?name=appleboy&address=xyz"
# Output: {"address":"xyz","name":"appleboy"}

# POST with query parameters -- body is ignored, only query is bound
curl -X POST "http://localhost:8085/testing?name=appleboy&address=xyz" \
  -d "name=ignored&address=ignored"
# Output: {"address":"xyz","name":"appleboy"}
```

## 関連項目

- [クエリ文字列またはポストデータのバインド](/ja/docs/binding/bind-query-or-post/)
- [バインドとバリデーション](/ja/docs/binding/binding-and-validation/)
