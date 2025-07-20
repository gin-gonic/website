---
title: "綁定查詢字串或 POST 資料"
---

詳情請參閱[此處](https://github.com/gin-gonic/gin/issues/742#issuecomment-264681292)。

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
  // 若為 `GET`，僅使用 `Form` 綁定引擎 (`query`)。
  // 若為 `POST`，則先檢查 `content-type` 是否為 `JSON` 或 `XML`，然後使用 `Form` (`form-data`)。
  // 更多資訊請參閱 https://github.com/gin-gonic/gin/blob/master/binding/binding.go#L48
  if c.ShouldBind(&person) == nil {
    log.Println(person.Name)
    log.Println(person.Address)
    log.Println(person.Birthday)
  }

  c.String(200, "成功")
}
```

使用以下指令進行測試：

```sh
curl -X GET "localhost:8085/testing?name=appleboy&address=xyz&birthday=1992-03-15"
```
