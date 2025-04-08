---
title: "Vincular a sequência de caracteres de consulta ou publicar dados"
---

Consulte a [informação detalhada](https://github.com/gin-gonic/gin/issues/742#issuecomment-264681292):

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
	// Se `GET`, apenas o motor de vinculação de `Form` (`query`) é usada.
	// Se `POST`, primeiro conferi o `content-type` por `JSON` ou `XML`, depois use o `Form` (`form-data`).
	// Consulte mais na https://github.com/gin-gonic/gin/blob/master/binding/binding.go#L48
	if c.ShouldBind(&person) == nil {
		log.Println(person.Name)
		log.Println(person.Address)
		log.Println(person.Birthday)
	}

	c.String(200, "Success")
}
```

Testá-lo com:

```sh
$ curl -X GET "localhost:8085/testing?name=appleboy&address=xyz&birthday=1992-03-15"
```
