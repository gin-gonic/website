---
title: "仅绑定查询字符串"
sidebar:
  order: 3
---

`ShouldBindQuery` 函数仅绑定查询参数，不绑定 POST 数据。详情请参阅[详细信息](https://github.com/gin-gonic/gin/issues/742#issuecomment-315953017)。

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
