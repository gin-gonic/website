---
title: "ربط مربعات اختيار HTML"
sidebar:
  order: 10
---

مربعات اختيار HTML التي لها نفس خاصية `name` ترسل قيماً متعددة عند تحديدها. يمكن لـ Gin ربط هذه القيم مباشرة في شريحة `[]string` في هيكلك باستخدام علامة الهيكل `form` مع لاحقة `[]` المطابقة لاسم HTML.

هذا مفيد للنماذج التي يختار فيها المستخدمون خياراً واحداً أو أكثر — مثل منتقيات الألوان أو محددات الأذونات أو مرشحات الاختيار المتعدد.

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

نموذج HTML المقابل (`templates/form.html`):

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

## اختبره

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
اللاحقة `[]` في `colors[]` هي اصطلاح HTML، وليست متطلباً في Go. يجب أن تتطابق علامة الهيكل مع خاصية `name` في HTML تماماً. إذا كان HTML يستخدم `name="colors"` (بدون أقواس)، فيجب أن تكون علامة الهيكل `form:"colors"`.
:::

## انظر أيضاً

- [الربط والتحقق](/ar/docs/binding/binding-and-validation/)
- [ربط Multipart/Urlencoded](/ar/docs/binding/multipart-urlencoded-binding/)
