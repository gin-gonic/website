---
title: "Привязка URI"
sidebar:
  order: 7
---

`ShouldBindUri` привязывает параметры URI-пути непосредственно к структуре, используя теги структуры `uri`. В сочетании с тегами валидации `binding` это позволяет проверять параметры пути (например, требовать валидный UUID) одним вызовом.

Это полезно, когда ваш маршрут содержит структурированные данные — такие как идентификаторы ресурсов или слаги — которые вы хотите валидировать и проверять типы перед использованием.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

type Person struct {
  ID   string `uri:"id" binding:"required,uuid"`
  Name string `uri:"name" binding:"required"`
}

func main() {
  route := gin.Default()

  route.GET("/:name/:id", func(c *gin.Context) {
    var person Person
    if err := c.ShouldBindUri(&person); err != nil {
      c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      return
    }
    c.JSON(http.StatusOK, gin.H{"name": person.Name, "uuid": person.ID})
  })

  route.Run(":8088")
}
```

## Тестирование

```sh
# Valid UUID -- binding succeeds
curl http://localhost:8088/thinkerou/987fbc97-4bed-5078-9f07-9141ba07c9f3
# Output: {"name":"thinkerou","uuid":"987fbc97-4bed-5078-9f07-9141ba07c9f3"}

# Invalid UUID -- binding fails with validation error
curl http://localhost:8088/thinkerou/not-uuid
# Output: {"error":"Key: 'Person.ID' Error:Field validation for 'ID' failed on the 'uuid' tag"}
```

:::note
Имя тега структуры `uri` должно совпадать с именем параметра в определении маршрута. Например, `:id` в маршруте соответствует `uri:"id"` в структуре.
:::

## Смотрите также

- [Параметры в пути](/ru/docs/routing/param-in-path/)
- [Привязка и валидация](/ru/docs/binding/binding-and-validation/)
