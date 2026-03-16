---
title: "嘗試將請求主體綁定到不同結構體"
sidebar:
  order: 13
---

標準的綁定方法如 `c.ShouldBind` 會消耗 `c.Request.Body`，它是一個 `io.ReadCloser`——一旦讀取後就無法再次讀取。這意味著你無法對同一個請求多次呼叫 `c.ShouldBind` 來嘗試不同的結構體。

要解決這個問題，請使用 `c.ShouldBindBodyWith`。它會讀取一次主體並將其儲存在上下文中，允許後續的綁定重複使用快取的主體。

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
  "github.com/gin-gonic/gin/binding"
)

type formA struct {
  Foo string `json:"foo" xml:"foo" binding:"required"`
}

type formB struct {
  Bar string `json:"bar" xml:"bar" binding:"required"`
}

func main() {
  router := gin.Default()

  router.POST("/bind", func(c *gin.Context) {
    objA := formA{}
    objB := formB{}
    // This reads c.Request.Body and stores the result into the context.
    if errA := c.ShouldBindBodyWith(&objA, binding.JSON); errA == nil {
      c.JSON(http.StatusOK, gin.H{"message": "matched formA", "foo": objA.Foo})
      return
    }
    // At this time, it reuses body stored in the context.
    if errB := c.ShouldBindBodyWith(&objB, binding.JSON); errB == nil {
      c.JSON(http.StatusOK, gin.H{"message": "matched formB", "bar": objB.Bar})
      return
    }

    c.JSON(http.StatusBadRequest, gin.H{"error": "request body did not match any known format"})
  })

  router.Run(":8080")
}
```

## 測試

```sh
# Body matches formA
curl -X POST http://localhost:8080/bind \
  -H "Content-Type: application/json" \
  -d '{"foo":"hello"}'
# Output: {"foo":"hello","message":"matched formA"}

# Body matches formB
curl -X POST http://localhost:8080/bind \
  -H "Content-Type: application/json" \
  -d '{"bar":"world"}'
# Output: {"bar":"world","message":"matched formB"}
```

:::note
`c.ShouldBindBodyWith` 會在綁定之前將主體儲存到上下文中。這會有輕微的效能影響，因此僅在需要多次綁定主體時才使用它。對於不讀取主體的格式——例如 `Query`、`Form`、`FormPost`、`FormMultipart`——你可以多次呼叫 `c.ShouldBind()` 而不會有問題。
:::

## 另請參閱

- [綁定與驗證](/zh-tw/docs/binding/binding-and-validation/)
- [綁定查詢字串或 POST 資料](/zh-tw/docs/binding/bind-query-or-post/)
