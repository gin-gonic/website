---
title: "Gövdeyi farklı struct'lara bağlamayı deneme"
sidebar:
  order: 13
---

`c.ShouldBind` gibi standart bağlama metodları, bir `io.ReadCloser` olan `c.Request.Body`'yi tüketir — bir kez okunduktan sonra tekrar okunamaz. Bu, aynı istek üzerinde farklı struct yapılarını denemek için `c.ShouldBind`'ı birden fazla kez çağıramayacağınız anlamına gelir.

Bu sorunu çözmek için `c.ShouldBindBodyWith` kullanın. Bu metod gövdeyi bir kez okur ve context'te saklar, böylece sonraki bağlamalar önbelleğe alınmış gövdeyi yeniden kullanabilir.

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

## Test et

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
`c.ShouldBindBodyWith` bağlamadan önce gövdeyi context'te saklar. Bu, performansı biraz etkiler, bu nedenle yalnızca gövdeyi birden fazla kez bağlamanız gerektiğinde kullanın. Gövdeyi okumayan formatlar için — `Query`, `Form`, `FormPost`, `FormMultipart` gibi — `c.ShouldBind()` metodunu herhangi bir sorun olmadan birden fazla kez çağırabilirsiniz.
:::

## Ayrıca bakınız

- [Bağlama ve doğrulama](/tr/docs/binding/binding-and-validation/)
- [Sorgu dizesi veya post verisi bağlama](/tr/docs/binding/bind-query-or-post/)
