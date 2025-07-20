---
title: "僅綁定查詢字串"
---

`ShouldBindQuery` 函式僅綁定查詢參數，而不綁定 POST 資料。詳情請參閱[此處](https://github.com/gin-gonic/gin/issues/742#issuecomment-315953017)。

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
    log.Println("====== 僅透過查詢字串綁定 ======")
    log.Println(person.Name)
    log.Println(person.Address)
  }
  c.String(200, "成功")
}
```
