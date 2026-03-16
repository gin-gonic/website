---
title: "仅绑定查询字符串"
sidebar:
  order: 3
---

`ShouldBindQuery` 仅将 URL 查询字符串参数绑定到结构体，完全忽略请求体。当你需要确保 POST 请求体数据不会意外覆盖查询参数时——例如在同时接受查询过滤器和 JSON 请求体的端点中——这将非常有用。

相比之下，`ShouldBind` 在 GET 请求中也使用查询绑定，但在 POST 请求中它会首先检查请求体。当你明确需要仅绑定查询字符串而不考虑 HTTP 方法时，请使用 `ShouldBindQuery`。

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

## 测试

```sh
# GET with query parameters
curl "http://localhost:8085/testing?name=appleboy&address=xyz"
# Output: {"address":"xyz","name":"appleboy"}

# POST with query parameters -- body is ignored, only query is bound
curl -X POST "http://localhost:8085/testing?name=appleboy&address=xyz" \
  -d "name=ignored&address=ignored"
# Output: {"address":"xyz","name":"appleboy"}
```

## 另请参阅

- [绑定查询字符串或 POST 数据](/zh-cn/docs/binding/bind-query-or-post/)
- [绑定和验证](/zh-cn/docs/binding/binding-and-validation/)
