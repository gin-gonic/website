---
title: "HTMLチェックボックスのバインド"
sidebar:
  order: 10
---

同じ `name` 属性を持つHTMLチェックボックスは、チェックされると複数の値を送信します。Ginは、`form` 構造体タグとHTML名に一致する `[]` サフィックスを使用して、これらの値を構造体の `[]string` スライスに直接バインドできます。

これは、カラーピッカー、権限セレクター、マルチセレクトフィルターなど、ユーザーが1つ以上のオプションを選択するフォームに便利です。

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

対応するHTMLフォーム（`templates/form.html`）：

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

## テスト

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
`colors[]` の `[]` サフィックスはHTMLの慣例であり、Goの要件ではありません。構造体タグはHTMLの `name` 属性と正確に一致する必要があります。HTMLが `name="colors"`（括弧なし）を使用している場合、構造体タグは `form:"colors"` にする必要があります。
:::

## 関連項目

- [バインドとバリデーション](/ja/docs/binding/binding-and-validation/)
- [Multipart/URLエンコードバインディング](/ja/docs/binding/multipart-urlencoded-binding/)
