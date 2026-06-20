---
title: "将请求体绑定到不同的结构体"
sidebar:
  order: 13
---

标准的绑定方法如 `c.ShouldBind` 会消费 `c.Request.Body`，它是一个 `io.ReadCloser`——一旦读取后就无法再次读取。这意味着你不能对同一个请求多次调用 `c.ShouldBind` 来尝试不同的结构体。

要解决这个问题，请使用 `c.ShouldBindBodyWith`。它会读取一次请求体并将其存储在上下文中，允许后续的绑定重用缓存的请求体。

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

## 测试

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
`c.ShouldBindBodyWith` 在绑定之前会将请求体存储到上下文中。这会对性能产生轻微影响，因此仅在需要多次绑定请求体时使用。对于不读取请求体的格式——如 `Query`、`Form`、`FormPost`、`FormMultipart`——你可以多次调用 `c.ShouldBind()` 而不会有任何问题。
:::

## 另请参阅

- [绑定和验证](/zh-cn/docs/binding/binding-and-validation/)
- [绑定查询字符串或 POST 数据](/zh-cn/docs/binding/bind-query-or-post/)
