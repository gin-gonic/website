---
title: "綁定 HTML 核取方塊"
---

詳情請參閱[此處](https://github.com/gin-gonic/gin/issues/129#issuecomment-124260092)。

main.go

```go
import (
  "net/http"

  "github.com/gin-gonic/gin"
)

type myForm struct {
  Colors []string `form:"colors[]"`
}

func main() {
  router := gin.Default()
  router.GET("/", func(c *gin.Context) {
    c.HTML(http.StatusOK, "form.html", nil)
  })
  router.POST("/", formHandler)
  router.LoadHTMLFiles("form.html")

  router.Run()
}

func formHandler(c *gin.Context) {
  var fakeForm myForm
  c.ShouldBind(&fakeForm)
  c.JSON(http.StatusOK, gin.H{"color": fakeForm.Colors})
}

```

form.html

```html
<form action="/" method="POST">
    <p>請勾選一些顏色</p>
    <label for="red">紅色</label>
    <input type="checkbox" name="colors[]" value="red" id="red">
    <label for="green">綠色</label>
    <input type="checkbox" name="colors[]" value="green" id="green">
    <label for="blue">藍色</label>
    <input type="checkbox" name="colors[]" value="blue" id="blue">
    <input type="submit">
</form>
```

結果：

```sh
{"color":["red","green","blue"]}
```
