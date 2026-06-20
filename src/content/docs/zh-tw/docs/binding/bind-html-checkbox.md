---
title: "綁定 HTML 核取方塊"
sidebar:
  order: 10
---

具有相同 `name` 屬性的 HTML 核取方塊在勾選時會提交多個值。Gin 可以使用帶有 `[]` 後綴的 `form` 結構體標籤（與 HTML 名稱匹配）將這些值直接綁定到結構體上的 `[]string` 切片。

這對於使用者選擇一個或多個選項的表單非常有用——例如顏色選擇器、權限選取器或多選篩選器。

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

對應的 HTML 表單（`templates/form.html`）：

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

## 測試

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
`colors[]` 中的 `[]` 後綴是 HTML 慣例，不是 Go 的要求。結構體標籤必須與 HTML 的 `name` 屬性完全匹配。如果你的 HTML 使用 `name="colors"`（不帶方括號），你的結構體標籤應為 `form:"colors"`。
:::

## 另請參閱

- [綁定與驗證](/zh-tw/docs/binding/binding-and-validation/)
- [Multipart/Urlencoded 綁定](/zh-tw/docs/binding/multipart-urlencoded-binding/)
