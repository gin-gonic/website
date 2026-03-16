---
title: "HTML checkbox bağlama"
sidebar:
  order: 10
---

Aynı `name` özelliğine sahip HTML checkbox'ları, işaretlendiğinde birden fazla değer gönderir. Gin, `form` struct etiketini HTML adıyla eşleşen `[]` sonekiyle kullanarak bu değerleri doğrudan struct'ınızdaki bir `[]string` dilime bağlayabilir.

Bu, kullanıcıların bir veya daha fazla seçenek seçtiği formlar için kullanışlıdır — renk seçiciler, izin seçiciler veya çoklu seçim filtreleri gibi.

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

Karşılık gelen HTML formu (`templates/form.html`):

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

## Test et

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
`colors[]` içindeki `[]` soneki bir HTML kuralıdır, Go gerekliliği değildir. Struct etiketi HTML `name` özelliğiyle tam olarak eşleşmelidir. HTML'niz `name="colors"` (parantez olmadan) kullanıyorsa, struct etiketiniz `form:"colors"` olmalıdır.
:::

## Ayrıca bakınız

- [Bağlama ve doğrulama](/tr/docs/binding/binding-and-validation/)
- [Multipart/Urlencoded bağlama](/tr/docs/binding/multipart-urlencoded-binding/)
