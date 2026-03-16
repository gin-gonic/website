---
title: "اتصال چک‌باکس‌های HTML"
sidebar:
  order: 10
---

چک‌باکس‌های HTML با ویژگی `name` یکسان، هنگام انتخاب شدن مقادیر متعددی ارسال می‌کنند. Gin می‌تواند این مقادیر را مستقیماً با استفاده از تگ `form` در struct به یک اسلایس `[]string` متصل کند.

این برای فرم‌هایی مفید است که کاربران یک یا چند گزینه انتخاب می‌کنند -- مانند انتخاب‌گر رنگ، انتخاب‌گر دسترسی، یا فیلترهای چندگزینه‌ای.

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

فرم HTML مربوطه (`templates/form.html`):

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

## تست

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
پسوند `[]` در `colors[]` یک قرارداد HTML است، نه یک الزام Go. تگ struct باید دقیقاً با ویژگی `name` در HTML مطابقت داشته باشد. اگر HTML شما از `name="colors"` (بدون براکت) استفاده می‌کند، تگ struct شما باید `form:"colors"` باشد.
:::

## همچنین ببینید

- [اتصال و اعتبارسنجی](/fa/docs/binding/binding-and-validation/)
- [اتصال Multipart/Urlencoded](/fa/docs/binding/multipart-urlencoded-binding/)
