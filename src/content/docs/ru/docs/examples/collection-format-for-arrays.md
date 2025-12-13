---
title: "Формат коллекции для массивов"
---

Вы можете контролировать, как Gin разделяет значения списка для полей slice/array, используя тег структуры `collection_format` при привязке форм.

Поддерживаемые форматы (v1.11+):

- multi (по умолчанию): повторяющиеся ключи или значения, разделённые запятыми
- csv: значения, разделённые запятыми
- ssv: значения, разделённые пробелами
- tsv: значения, разделённые табуляцией
- pipes: значения, разделённые вертикальной чертой

Пример:

```go
package main

import (
  "net/http"
  "github.com/gin-gonic/gin"
)

type Filters struct {
  Tags      []string `form:"tags" collection_format:"csv"`     // /search?tags=go,web,api
  Labels    []string `form:"labels" collection_format:"multi"` // /search?labels=bug&labels=helpwanted
  IdsSSV    []int    `form:"ids_ssv" collection_format:"ssv"`  // /search?ids_ssv=1 2 3
  IdsTSV    []int    `form:"ids_tsv" collection_format:"tsv"`  // /search?ids_tsv=1\t2\t3
  Levels    []int    `form:"levels" collection_format:"pipes"` // /search?levels=1|2|3
}

func main() {
  r := gin.Default()
  r.GET("/search", func(c *gin.Context) {
    var f Filters
    if err := c.ShouldBind(&f); err != nil {
      c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      return
    }
    c.JSON(http.StatusOK, f)
  })
  r.Run(":8080")
}
```

Значения по умолчанию для коллекций (v1.11+):

- Используйте `default` в теге `form` для установки резервных значений.
- Для `multi` и `csv` разделяйте значения по умолчанию точкой с запятой: `default=1;2;3`.
- Для `ssv`, `tsv` и `pipes` используйте естественный разделитель в значении по умолчанию.

См. также: пример «Привязка значений по умолчанию для полей формы».
