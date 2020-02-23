---
title: "쿼리 문자열만 바인딩하기"
draft: false
---

`ShouldBindQuery` 함수는 POST 데이터가 아닌 쿼리 파라미터만 바인딩 합니다. [자세한 정보](https://github.com/gin-gonic/gin/issues/742#issuecomment-315953017)를 확인 하세요.

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
