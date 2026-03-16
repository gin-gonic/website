---
title: "綁定查詢字串或 POST 資料"
sidebar:
  order: 4
---

`ShouldBind` 會根據 HTTP 方法和 `Content-Type` 標頭自動選擇綁定引擎：

- 對於 **GET** 請求，使用查詢字串綁定（`form` 標籤）。
- 對於 **POST/PUT** 請求，會檢查 `Content-Type`——對 `application/json` 使用 JSON 綁定，對 `application/xml` 使用 XML 綁定，對 `application/x-www-form-urlencoded` 或 `multipart/form-data` 使用表單綁定。

這意味著單一處理器可以接受來自查詢字串和請求主體的資料，而無需手動選擇來源。

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

## 測試

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
`time_format` 標籤使用 Go 的[參考時間格式](https://pkg.go.dev/time#pkg-constants)。格式 `2006-01-02` 表示「年-月-日」。`time_utc:"1"` 標籤確保解析的時間為 UTC。
:::

## 另請參閱

- [綁定與驗證](/zh-tw/docs/binding/binding-and-validation/)
- [僅綁定查詢字串](/zh-tw/docs/binding/only-bind-query-string/)
- [綁定標頭](/zh-tw/docs/binding/bind-header/)
