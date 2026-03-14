---
title: "クエリ文字列またはポストデータのバインド"
sidebar:
  order: 4
---

[詳細情報](https://github.com/gin-gonic/gin/issues/742#issuecomment-264681292)をご覧ください。

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
  // `GET`の場合、`Form`バインディングエンジン（`query`）のみ使用されます。
  // `POST`の場合、まず`content-type`で`JSON`または`XML`をチェックし、次に`Form`（`form-data`）を使用します。
  // 詳細はhttps://github.com/gin-gonic/gin/blob/master/binding/binding.go#L48を参照
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

テスト方法：

```sh
curl -X GET "localhost:8085/testing?name=appleboy&address=xyz&birthday=1992-03-15"
```
