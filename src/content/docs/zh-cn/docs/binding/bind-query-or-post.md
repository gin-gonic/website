---
title: "绑定查询字符串或 POST 数据"
sidebar:
  order: 4
---

`ShouldBind` 会根据 HTTP 方法和 `Content-Type` 请求头自动选择绑定引擎：

- 对于 **GET** 请求，使用查询字符串绑定（`form` 标签）。
- 对于 **POST/PUT** 请求，它会检查 `Content-Type`——对 `application/json` 使用 JSON 绑定，对 `application/xml` 使用 XML 绑定，对 `application/x-www-form-urlencoded` 或 `multipart/form-data` 使用表单绑定。

这意味着单个处理函数可以同时接受来自查询字符串和请求体的数据，无需手动选择数据源。

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

## 测试

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
`time_format` 标签使用 Go 的[参考时间布局](https://pkg.go.dev/time#pkg-constants)。格式 `2006-01-02` 表示"年-月-日"。`time_utc:"1"` 标签确保解析后的时间为 UTC 时区。
:::

## 另请参阅

- [绑定和验证](/zh-cn/docs/binding/binding-and-validation/)
- [仅绑定查询字符串](/zh-cn/docs/binding/only-bind-query-string/)
- [绑定请求头](/zh-cn/docs/binding/bind-header/)
