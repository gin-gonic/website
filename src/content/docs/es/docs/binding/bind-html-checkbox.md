---
title: "Enlazar checkboxes HTML"
sidebar:
  order: 10
---

Los checkboxes HTML con el mismo atributo `name` envían múltiples valores cuando están marcados. Gin puede enlazar estos valores directamente en un slice `[]string` en tu struct usando la etiqueta de struct `form` con el sufijo `[]` que coincida con el nombre HTML.

Esto es útil para formularios donde los usuarios seleccionan una o más opciones — como selectores de color, selectores de permisos o filtros de selección múltiple.

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

El formulario HTML correspondiente (`templates/form.html`):

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

## Pruébalo

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
El sufijo `[]` en `colors[]` es una convención HTML, no un requisito de Go. La etiqueta del struct debe coincidir exactamente con el atributo `name` del HTML. Si tu HTML usa `name="colors"` (sin corchetes), tu etiqueta de struct debería ser `form:"colors"`.
:::

## Ver también

- [Enlace y validación](/es/docs/binding/binding-and-validation/)
- [Enlace Multipart/Urlencoded](/es/docs/binding/multipart-urlencoded-binding/)
