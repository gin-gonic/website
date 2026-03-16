---
title: "Привязка тела к разным структурам"
sidebar:
  order: 13
---

Стандартные методы привязки, такие как `c.ShouldBind`, потребляют `c.Request.Body`, который является `io.ReadCloser` — после чтения его нельзя прочитать повторно. Это означает, что вы не можете вызывать `c.ShouldBind` несколько раз для одного запроса, чтобы попробовать разные структуры.

Для решения этой проблемы используйте `c.ShouldBindBodyWith`. Он читает тело один раз и сохраняет его в контексте, позволяя последующим привязкам повторно использовать кэшированное тело.

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

## Тестирование

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
`c.ShouldBindBodyWith` сохраняет тело в контексте перед привязкой. Это немного влияет на производительность, поэтому используйте его только тогда, когда вам нужно привязать тело более одного раза. Для форматов, которые не читают тело — таких как `Query`, `Form`, `FormPost`, `FormMultipart` — вы можете вызывать `c.ShouldBind()` несколько раз без проблем.
:::

## Смотрите также

- [Привязка и валидация](/ru/docs/binding/binding-and-validation/)
- [Привязка строки запроса или POST-данных](/ru/docs/binding/bind-query-or-post/)
