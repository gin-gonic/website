---
title: "クエリ文字列あるいはポストされたデータをバインドする"
draft: false
---

[詳細](https://github.com/gin-gonic/gin/issues/742#issuecomment-264681292) はこちら。

```go
package main

import (
	"log"
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
	route.Run(":8085")
}

func startPage(c *gin.Context) {
	var person Person
	// `GET` の場合、`Form` (クエリ文字列) がバインディングのみが使われます
	// `POST` の場合、まず `JSON` か `XML` か判断するために `content-type` がチェックされ、そして `Form` (フォームデータ) が使われます。
	// 詳細は https://github.com/gin-gonic/gin/blob/master/binding/binding.go#L48 を参照
	if c.ShouldBind(&person) == nil {
		log.Println(person.Name)
		log.Println(person.Address)
		log.Println(person.Birthday)
	}

	c.String(200, "Success")
}
```

以下のコードでテストできます。
```sh
$ curl -X GET "localhost:8085/testing?name=appleboy&address=xyz&birthday=1992-03-15"
```
