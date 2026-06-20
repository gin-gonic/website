---
title: "Привязка только строки запроса"
sidebar:
  order: 3
---

`ShouldBindQuery` привязывает только параметры строки запроса URL к структуре, полностью игнорируя тело запроса. Это полезно, когда вы хотите убедиться, что данные тела POST-запроса случайно не перезапишут параметры запроса — например, в эндпоинтах, которые принимают как фильтры в строке запроса, так и JSON-тело.

В отличие от этого, `ShouldBind` для GET-запроса также использует привязку строки запроса, но для POST-запроса сначала проверяет тело. Используйте `ShouldBindQuery`, когда вам явно нужна привязка только строки запроса независимо от HTTP-метода.

```go
package main

import (
  "net/http"

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
  if err := c.ShouldBindQuery(&person); err != nil {
    c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
    return
  }

  c.JSON(http.StatusOK, gin.H{
    "name":    person.Name,
    "address": person.Address,
  })
}
```

## Тестирование

```sh
# GET with query parameters
curl "http://localhost:8085/testing?name=appleboy&address=xyz"
# Output: {"address":"xyz","name":"appleboy"}

# POST with query parameters -- body is ignored, only query is bound
curl -X POST "http://localhost:8085/testing?name=appleboy&address=xyz" \
  -d "name=ignored&address=ignored"
# Output: {"address":"xyz","name":"appleboy"}
```

## Смотрите также

- [Привязка строки запроса или POST-данных](/ru/docs/binding/bind-query-or-post/)
- [Привязка и валидация](/ru/docs/binding/binding-and-validation/)
