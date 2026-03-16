---
title: "Bind html checkboxes"
sidebar:
  order: 10
---

HTML checkboxes with the same `name` attribute submit multiple values when checked. Gin can bind these values directly into a `[]string` slice on your struct by using the `form` struct tag with the `[]` suffix matching the HTML name.

This is useful for forms where users select one or more options — such as color pickers, permission selectors, or multi-select filters.

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

The corresponding HTML form (`templates/form.html`):

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

## Test it

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
The `[]` suffix in `colors[]` is an HTML convention, not a Go requirement. The struct tag must match the HTML `name` attribute exactly. If your HTML uses `name="colors"` (without brackets), your struct tag should be `form:"colors"`.
:::

## See also

- [Binding and validation](/en/docs/binding/binding-and-validation/)
- [Multipart/urlencoded binding](/en/docs/binding/multipart-urlencoded-binding/)
