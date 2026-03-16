---
title: "Hanya bind query string"
sidebar:
  order: 3
---

`ShouldBindQuery` hanya melakukan bind parameter query string URL ke struct, mengabaikan body request sepenuhnya. Ini berguna ketika Anda ingin memastikan bahwa data body POST tidak secara tidak sengaja menimpa parameter query — misalnya, pada endpoint yang menerima filter query dan body JSON.

Sebaliknya, `ShouldBind` pada request GET juga menggunakan binding query, tetapi pada request POST akan memeriksa body terlebih dahulu. Gunakan `ShouldBindQuery` ketika Anda secara eksplisit menginginkan binding khusus query terlepas dari metode HTTP.

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

## Uji coba

```sh
# GET with query parameters
curl "http://localhost:8085/testing?name=appleboy&address=xyz"
# Output: {"address":"xyz","name":"appleboy"}

# POST with query parameters -- body is ignored, only query is bound
curl -X POST "http://localhost:8085/testing?name=appleboy&address=xyz" \
  -d "name=ignored&address=ignored"
# Output: {"address":"xyz","name":"appleboy"}
```

## Lihat juga

- [Bind query string atau post data](/id/docs/binding/bind-query-or-post/)
- [Binding dan validasi](/id/docs/binding/binding-and-validation/)
