---
title: "Привязка строки запроса или POST-данных"
sidebar:
  order: 4
---

`ShouldBind` автоматически выбирает движок привязки на основе HTTP-метода и заголовка `Content-Type`:

- Для запросов **GET** используется привязка строки запроса (теги `form`).
- Для запросов **POST/PUT** проверяется `Content-Type` — используется привязка JSON для `application/json`, XML для `application/xml` и привязка формы для `application/x-www-form-urlencoded` или `multipart/form-data`.

Это означает, что один обработчик может принимать данные как из строк запроса, так и из тел запросов без ручного выбора источника.

```go
package main

import (
  "log"
  "net/http"
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
  route.POST("/testing", startPage)
  route.Run(":8085")
}

func startPage(c *gin.Context) {
  var person Person
  if err := c.ShouldBind(&person); err != nil {
    c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
    return
  }

  log.Printf("Name: %s, Address: %s, Birthday: %s\n", person.Name, person.Address, person.Birthday)
  c.JSON(http.StatusOK, gin.H{
    "name":     person.Name,
    "address":  person.Address,
    "birthday": person.Birthday,
  })
}
```

## Тестирование

```sh
# GET with query string parameters
curl "http://localhost:8085/testing?name=appleboy&address=xyz&birthday=1992-03-15"
# Output: {"address":"xyz","birthday":"1992-03-15T00:00:00Z","name":"appleboy"}

# POST with form data
curl -X POST http://localhost:8085/testing \
  -d "name=appleboy&address=xyz&birthday=1992-03-15"
# Output: {"address":"xyz","birthday":"1992-03-15T00:00:00Z","name":"appleboy"}

# POST with JSON body
curl -X POST http://localhost:8085/testing \
  -H "Content-Type: application/json" \
  -d '{"name":"appleboy","address":"xyz","birthday":"1992-03-15"}'
# Output: {"address":"xyz","birthday":"1992-03-15T00:00:00Z","name":"appleboy"}
```

:::note
Тег `time_format` использует [формат эталонного времени](https://pkg.go.dev/time#pkg-constants) Go. Формат `2006-01-02` означает «год-месяц-день». Тег `time_utc:"1"` гарантирует, что разобранное время будет в UTC.
:::

## Смотрите также

- [Привязка и валидация](/ru/docs/binding/binding-and-validation/)
- [Привязка только строки запроса](/ru/docs/binding/only-bind-query-string/)
- [Привязка заголовков](/ru/docs/binding/bind-header/)
