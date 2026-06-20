---
title: "綁定 URI"
sidebar:
  order: 7
---

`ShouldBindUri` 使用 `uri` 結構體標籤將 URI 路徑參數直接綁定到結構體。結合 `binding` 驗證標籤，這讓你可以用單一呼叫來驗證路徑參數（例如要求有效的 UUID）。

當你的路由包含結構化資料時——例如資源 ID 或 slug——且你想在使用之前驗證和型別檢查時，這非常有用。

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

## 測試

```sh
# Valid UUID -- binding succeeds
curl http://localhost:8088/thinkerou/987fbc97-4bed-5078-9f07-9141ba07c9f3
# Output: {"name":"thinkerou","uuid":"987fbc97-4bed-5078-9f07-9141ba07c9f3"}

# Invalid UUID -- binding fails with validation error
curl http://localhost:8088/thinkerou/not-uuid
# Output: {"error":"Key: 'Person.ID' Error:Field validation for 'ID' failed on the 'uuid' tag"}
```

:::note
`uri` 結構體標籤的名稱必須與路由定義中的參數名稱匹配。例如，路由中的 `:id` 對應結構體中的 `uri:"id"`。
:::

## 另請參閱

- [路徑參數](/zh-tw/docs/routing/param-in-path/)
- [綁定與驗證](/zh-tw/docs/binding/binding-and-validation/)
