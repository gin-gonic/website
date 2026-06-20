---
title: "Try to bind body into different structs"
sidebar:
  order: 13
---

The standard binding methods like `c.ShouldBind` consume `c.Request.Body`, which is an `io.ReadCloser` — once read, it cannot be read again. This means you cannot call `c.ShouldBind` multiple times on the same request to try different struct shapes.

To solve this, use `c.ShouldBindBodyWith`. It reads the body once and stores it in the context, allowing subsequent bindings to reuse the cached body.

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

## Test it

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
`c.ShouldBindBodyWith` stores the body in the context before binding. This has a slight performance impact, so only use it when you need to bind the body more than once. For formats that do not read the body — such as `Query`, `Form`, `FormPost`, `FormMultipart` — you can call `c.ShouldBind()` multiple times without issue.
:::

## See also

- [Binding and validation](/en/docs/binding/binding-and-validation/)
- [Bind query string or post data](/en/docs/binding/bind-query-or-post/)
