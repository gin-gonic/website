---
title: "Привязка HTML-чекбоксов"
sidebar:
  order: 10
---

HTML-чекбоксы с одинаковым атрибутом `name` отправляют несколько значений при выборе. Gin может привязать эти значения непосредственно к срезу `[]string` в вашей структуре, используя тег структуры `form` с суффиксом `[]`, соответствующим HTML-имени.

Это полезно для форм, где пользователи выбирают один или несколько вариантов — таких как выбор цветов, настройка разрешений или фильтры с множественным выбором.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

type myForm struct {
  Colors []string `form:"colors[]"`
}

func main() {
  router := gin.Default()

  router.LoadHTMLGlob("templates/*")

  router.GET("/", func(c *gin.Context) {
    c.HTML(http.StatusOK, "form.html", nil)
  })

  router.POST("/", func(c *gin.Context) {
    var fakeForm myForm
    if err := c.ShouldBind(&fakeForm); err != nil {
      c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      return
    }
    c.JSON(http.StatusOK, gin.H{"color": fakeForm.Colors})
  })

  router.Run(":8080")
}
```

Соответствующая HTML-форма (`templates/form.html`):

```html
<form action="/" method="POST">
    <p>Check some colors</p>
    <label for="red">Red</label>
    <input type="checkbox" name="colors[]" value="red" id="red">
    <label for="green">Green</label>
    <input type="checkbox" name="colors[]" value="green" id="green">
    <label for="blue">Blue</label>
    <input type="checkbox" name="colors[]" value="blue" id="blue">
    <input type="submit">
</form>
```

## Тестирование

```sh
# Select all three colors
curl -X POST http://localhost:8080/ \
  -d "colors[]=red&colors[]=green&colors[]=blue"
# Output: {"color":["red","green","blue"]}

# Select only one color
curl -X POST http://localhost:8080/ \
  -d "colors[]=green"
# Output: {"color":["green"]}

# No checkboxes selected -- slice is empty
curl -X POST http://localhost:8080/
# Output: {"color":[]}
```

:::tip
Суффикс `[]` в `colors[]` — это HTML-соглашение, а не требование Go. Тег структуры должен точно совпадать с HTML-атрибутом `name`. Если ваш HTML использует `name="colors"` (без скобок), тег структуры должен быть `form:"colors"`.
:::

## Смотрите также

- [Привязка и валидация](/ru/docs/binding/binding-and-validation/)
- [Привязка Multipart/Urlencoded](/ru/docs/binding/multipart-urlencoded-binding/)
