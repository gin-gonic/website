---
title: "쿼리 문자열만 바인딩"
sidebar:
  order: 3
---

`ShouldBindQuery` 함수는 쿼리 매개변수만 바인딩하고 POST 데이터는 바인딩하지 않습니다. [상세 정보](https://github.com/gin-gonic/gin/issues/742#issuecomment-315953017)를 참조하세요.

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
