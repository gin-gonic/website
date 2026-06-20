---
title: "Yalnızca sorgu dizesi bağlama"
sidebar:
  order: 3
---

`ShouldBindQuery`, istek gövdesini tamamen yok sayarak yalnızca URL sorgu dizesi parametrelerini bir struct'a bağlar. Bu, POST gövde verisinin sorgu parametrelerini yanlışlıkla geçersiz kılmamasını sağlamak istediğinizde kullanışlıdır — örneğin, hem sorgu filtreleri hem de JSON gövdesi kabul eden uç noktalarda.

Buna karşılık, `ShouldBind` bir GET isteğinde de sorgu bağlaması kullanır, ancak bir POST isteğinde önce gövdeyi kontrol eder. HTTP metodundan bağımsız olarak açıkça yalnızca sorgu bağlaması istediğinizde `ShouldBindQuery` kullanın.

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

## Test et

```sh
# GET with query parameters
curl "http://localhost:8085/testing?name=appleboy&address=xyz"
# Output: {"address":"xyz","name":"appleboy"}

# POST with query parameters -- body is ignored, only query is bound
curl -X POST "http://localhost:8085/testing?name=appleboy&address=xyz" \
  -d "name=ignored&address=ignored"
# Output: {"address":"xyz","name":"appleboy"}
```

## Ayrıca bakınız

- [Sorgu dizesi veya post verisi bağlama](/tr/docs/binding/bind-query-or-post/)
- [Bağlama ve doğrulama](/tr/docs/binding/binding-and-validation/)
