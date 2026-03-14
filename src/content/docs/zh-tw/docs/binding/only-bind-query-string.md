---
title: "僅綁定查詢字串"
sidebar:
  order: 3
---

`ShouldBindQuery` 函式僅綁定查詢參數，不綁定 POST 資料。請參閱[詳細資訊](https://github.com/gin-gonic/gin/issues/742#issuecomment-315953017)。

```go
package main

import (
  "log"

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
  if c.ShouldBindQuery(&person) == nil {
    log.Println("====== Only Bind By Query String ======")
    log.Println(person.Name)
    log.Println(person.Address)
  }
  c.String(200, "Success")
}
```
