---
title: "HTML 체크박스 바인딩"
sidebar:
  order: 10
---

동일한 `name` 속성을 가진 HTML 체크박스는 선택 시 여러 값을 제출합니다. Gin은 `form` 구조체 태그를 사용하여 이러한 값을 구조체의 `[]string` 슬라이스에 직접 바인딩할 수 있으며, HTML name과 일치하는 `[]` 접미사를 사용합니다.

이는 색상 선택기, 권한 선택기 또는 다중 선택 필터와 같이 사용자가 하나 이상의 옵션을 선택하는 폼에 유용합니다.

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

해당 HTML 폼 (`templates/form.html`):

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

## 테스트

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
`colors[]`의 `[]` 접미사는 HTML 규칙이며 Go 요구 사항이 아닙니다. 구조체 태그는 HTML `name` 속성과 정확히 일치해야 합니다. HTML에서 `name="colors"` (괄호 없이)를 사용하는 경우 구조체 태그는 `form:"colors"`여야 합니다.
:::

## 참고

- [바인딩과 유효성 검사](/ko-kr/docs/binding/binding-and-validation/)
- [Multipart/URL 인코딩 바인딩](/ko-kr/docs/binding/multipart-urlencoded-binding/)
