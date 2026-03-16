---
title: "URIのバインド"
sidebar:
  order: 7
---

`ShouldBindUri` は、`uri` 構造体タグを使用してURIパスパラメータを直接構造体にバインドします。`binding` バリデーションタグと組み合わせることで、パスパラメータ（有効なUUIDを要求するなど）を1回の呼び出しでバリデーションできます。

これは、ルートにリソースIDやスラッグなどの構造化されたデータが含まれており、使用前にバリデーションと型チェックを行いたい場合に便利です。

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

type Person struct {
  ID   string `uri:"id" binding:"required,uuid"`
  Name string `uri:"name" binding:"required"`
}

func main() {
  route := gin.Default()

  route.GET("/:name/:id", func(c *gin.Context) {
    var person Person
    if err := c.ShouldBindUri(&person); err != nil {
      c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      return
    }
    c.JSON(http.StatusOK, gin.H{"name": person.Name, "uuid": person.ID})
  })

  route.Run(":8088")
}
```

## テスト

```sh
# Valid UUID -- binding succeeds
curl http://localhost:8088/thinkerou/987fbc97-4bed-5078-9f07-9141ba07c9f3
# Output: {"name":"thinkerou","uuid":"987fbc97-4bed-5078-9f07-9141ba07c9f3"}

# Invalid UUID -- binding fails with validation error
curl http://localhost:8088/thinkerou/not-uuid
# Output: {"error":"Key: 'Person.ID' Error:Field validation for 'ID' failed on the 'uuid' tag"}
```

:::note
`uri` 構造体タグの名前は、ルート定義のパラメータ名と一致する必要があります。例えば、ルート内の `:id` は構造体の `uri:"id"` に対応します。
:::

## 関連項目

- [パス内のパラメータ](/ja/docs/routing/param-in-path/)
- [バインドとバリデーション](/ja/docs/binding/binding-and-validation/)
