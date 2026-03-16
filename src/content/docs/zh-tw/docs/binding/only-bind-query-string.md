---
title: "僅綁定查詢字串"
sidebar:
  order: 3
---

`ShouldBindQuery` 僅將 URL 查詢字串參數綁定到結構體，完全忽略請求主體。當你想確保 POST 主體資料不會意外覆蓋查詢參數時，這非常有用——例如在同時接受查詢篩選器和 JSON 主體的端點中。

相比之下，`ShouldBind` 在 GET 請求中也使用查詢綁定，但在 POST 請求中會先檢查主體。當你明確需要僅綁定查詢字串而不考慮 HTTP 方法時，請使用 `ShouldBindQuery`。

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

## 測試

```sh
# GET with query parameters
curl "http://localhost:8085/testing?name=appleboy&address=xyz"
# Output: {"address":"xyz","name":"appleboy"}

# POST with query parameters -- body is ignored, only query is bound
curl -X POST "http://localhost:8085/testing?name=appleboy&address=xyz" \
  -d "name=ignored&address=ignored"
# Output: {"address":"xyz","name":"appleboy"}
```

## 另請參閱

- [綁定查詢字串或 POST 資料](/zh-tw/docs/binding/bind-query-or-post/)
- [綁定與驗證](/zh-tw/docs/binding/binding-and-validation/)
