---
title: "Bind checkbox HTML"
sidebar:
  order: 10
---

Checkbox HTML dengan atribut `name` yang sama mengirimkan beberapa nilai saat dicentang. Gin dapat melakukan bind nilai-nilai ini langsung ke slice `[]string` pada struct Anda dengan menggunakan tag struct `form` dengan suffix `[]` yang sesuai dengan nama HTML.

Hal ini berguna untuk form yang pengguna dapat memilih satu atau lebih opsi — seperti color picker, permission selector, atau filter multi-pilihan.

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

Form HTML yang sesuai (`templates/form.html`):

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

## Uji coba

```sh
# Memilih ketiga warna
curl -X POST http://localhost:8080/ \
  -d "colors[]=red&colors[]=green&colors[]=blue"
# Output: {"color":["red","green","blue"]}

# Memilih salah satu warna
curl -X POST http://localhost:8080/ \
  -d "colors[]=green"
# Output: {"color":["green"]}

# Tidak mencentang checkbox sama sekali -- slice kosong
curl -X POST http://localhost:8080/
# Output: {"color":[]}
```

:::tip
Sufiks `[]` pada `colors[]` adalah konvensi HTML, bukan keharusan Go. Tag struct harus sama persis dengan atribut `name` HTML. Jika HTML Anda menggunakan `name="colors"` (tanpa tanda kurung), tag struct Anda harus `form:"colors"`.
:::

## Lihat juga

- [Binding dan validasi](/id/docs/binding/binding-and-validation/)
- [Binding Multipart/Urlencoded](/id/docs/binding/multipart-urlencoded-binding/)
