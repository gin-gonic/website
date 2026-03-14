---
title: "쿼리 문자열 또는 POST 데이터 바인딩"
sidebar:
  order: 4
---

[상세 정보](https://github.com/gin-gonic/gin/issues/742#issuecomment-264681292)를 참조하세요.

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
  // `GET`이면 `Form` 바인딩 엔진(`query`)만 사용됩니다.
  // `POST`이면 먼저 `content-type`에서 `JSON` 또는 `XML`을 확인한 후, `Form` (`form-data`)을 사용합니다.
  // 자세한 내용은 https://github.com/gin-gonic/gin/blob/master/binding/binding.go#L48 참조
  err := c.ShouldBind(&person)
  if err != nil {
    c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
    return
  }

  log.Println(person.Name)
  log.Println(person.Address)
  log.Println(person.Birthday)

  c.String(200, "Success")
}
```

다음으로 테스트하세요:

```sh
curl -X GET "localhost:8085/testing?name=appleboy&address=xyz&birthday=1992-03-15"
```
