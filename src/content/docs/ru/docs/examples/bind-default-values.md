---
title: "Привязка значений по умолчанию для полей формы"
---

Иногда вы хотите, чтобы поле использовало значение по умолчанию, когда клиент не отправляет значение. Привязка форм в Gin поддерживает значения по умолчанию через опцию `default` в теге структуры `form`. Это работает для скаляров и, начиная с Gin v1.11, для коллекций (срезов/массивов) с явными форматами коллекций.

Ключевые моменты:

- Укажите значение по умолчанию сразу после ключа формы: `form:"name,default=William"`.
- Для коллекций укажите способ разделения значений с помощью `collection_format:"multi|csv|ssv|tsv|pipes"`.
- Для `multi` и `csv` используйте точку с запятой в значении по умолчанию для разделения значений (например, `default=1;2;3`). Gin внутренне преобразует их в запятые, чтобы парсер тегов оставался однозначным.
- Для `ssv` (пробел), `tsv` (табуляция) и `pipes` (|) используйте естественный разделитель в значении по умолчанию.

Пример:

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

type Person struct {
  Name      string    `form:"name,default=William"`
  Age       int       `form:"age,default=10"`
  Friends   []string  `form:"friends,default=Will;Bill"`                     // multi/csv: используйте ; в значениях по умолчанию
  Addresses [2]string `form:"addresses,default=foo bar" collection_format:"ssv"`
  LapTimes  []int     `form:"lap_times,default=1;2;3" collection_format:"csv"`
}

func main() {
  r := gin.Default()
  r.POST("/person", func(c *gin.Context) {
    var req Person
    if err := c.ShouldBind(&req); err != nil { // определяет binder по Content-Type
      c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      return
    }
    c.JSON(http.StatusOK, req)
  })
  _ = r.Run(":8080")
}
```

Если вы отправите POST без тела, Gin ответит значениями по умолчанию:

```sh
curl -X POST http://localhost:8080/person
```

Ответ (пример):

```json
{
  "Name": "William",
  "Age": 10,
  "Friends": ["Will", "Bill"],
  "Addresses": ["foo", "bar"],
  "LapTimes": [1, 2, 3]
}
```

Примечания и предостережения:

- Запятые используются в синтаксисе тегов структур Go для разделения опций; избегайте запятых внутри значений по умолчанию.
- Для `multi` и `csv` точка с запятой разделяет значения по умолчанию; не включайте точку с запятой внутри отдельных значений по умолчанию для этих форматов.
- Недопустимые значения `collection_format` приведут к ошибке привязки.

Связанные изменения:

- Форматы коллекций для привязки форм (`multi`, `csv`, `ssv`, `tsv`, `pipes`) были улучшены примерно в версии v1.11.
- Значения по умолчанию для коллекций были добавлены в v1.11 (PR #4048).
