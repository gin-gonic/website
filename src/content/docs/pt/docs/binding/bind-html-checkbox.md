---
title: "Bind checkboxes HTML"
sidebar:
  order: 10
---

Checkboxes HTML com o mesmo atributo `name` enviam múltiplos valores quando marcados. O Gin pode vincular esses valores diretamente em um slice `[]string` na sua struct usando a tag de struct `form` com o sufixo `[]` correspondendo ao nome do HTML.

Isso é útil para formulários onde os usuários selecionam uma ou mais opções — como seletores de cores, seletores de permissões ou filtros de múltipla seleção.

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

O formulário HTML correspondente (`templates/form.html`):

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

## Teste

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
O sufixo `[]` em `colors[]` é uma convenção HTML, não um requisito do Go. A tag da struct deve corresponder exatamente ao atributo `name` do HTML. Se o seu HTML usa `name="colors"` (sem colchetes), a tag da sua struct deve ser `form:"colors"`.
:::

## Veja também

- [Binding e validação](/pt/docs/binding/binding-and-validation/)
- [Binding Multipart/Urlencoded](/pt/docs/binding/multipart-urlencoded-binding/)
