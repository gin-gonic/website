---
title: "쿼리 문자열 혹은 post 데이터를 바인드하기"
draft: false
---

[자세한 정보](https://github.com/gin-gonic/gin/issues/742#issuecomment-264681292)를 확인하세요.

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
	// `GET`의 경우 `Form` (`query`)만 사용됩니다.
	// `POST`의 경우, 먼저 `content-type`가 `JSON` 혹은 `XML`을 확인한 다음 `Form` (`form-data`)가 사용됩니다.
	// 자세한 정보는 https://github.com/gin-gonic/gin/blob/master/binding/binding.go#L48 를 참고하세요.
	if c.ShouldBind(&person) == nil {
		log.Println(person.Name)
		log.Println(person.Address)
		log.Println(person.Birthday)
	}

	c.String(200, "Success")
}
```

다음과 같이 테스트 할 수 있습니다:
```sh
$ curl -X GET "localhost:8085/testing?name=appleboy&address=xyz&birthday=1992-03-15"
```
