---
title: "绑定 HTML 复选框"
sidebar:
  order: 10
---

具有相同 `name` 属性的 HTML 复选框在被选中时会提交多个值。Gin 可以通过使用带有 `[]` 后缀的 `form` 结构体标签（匹配 HTML 的 name 属性）将这些值直接绑定到结构体的 `[]string` 切片中。

这对于用户选择一个或多个选项的表单非常有用——例如颜色选择器、权限选择器或多选过滤器。

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

对应的 HTML 表单（`templates/form.html`）：

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

## 测试

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
`colors[]` 中的 `[]` 后缀是 HTML 的约定，不是 Go 的要求。结构体标签必须与 HTML 的 `name` 属性完全匹配。如果你的 HTML 使用 `name="colors"`（不带方括号），你的结构体标签应该是 `form:"colors"`。
:::

## 另请参阅

- [绑定和验证](/zh-cn/docs/binding/binding-and-validation/)
- [Multipart/Urlencoded 绑定](/zh-cn/docs/binding/multipart-urlencoded-binding/)
