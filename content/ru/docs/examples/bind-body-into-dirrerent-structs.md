---
название: "Попытайтесь связать тело в разных структурах"
draft: false
---

Обычные методы для связывания тела запроса (request body) потребляют `c.Request.Body` и их
не могут быть вызваны несколько раз.

```go
type formA struct {
  Foo string `json:"foo" xml:"foo" binding:"required"`
}

type formB struct {
  Bar string `json:"bar" xml:"bar" binding:"required"`
}

func SomeHandler(c *gin.Context) {
  objA := formA{}
  objB := formB{}
  // This c.ShouldBind consumes c.Request.Body and it cannot be reused.
  if errA := c.ShouldBind(&objA); errA == nil {
    c.String(http.StatusOK, `the body should be formA`)
  // Always an error is occurred by this because c.Request.Body is EOF now.
  } else if errB := c.ShouldBind(&objB); errB == nil {
    c.String(http.StatusOK, `the body should be formB`)
  } else {
    ...
  }
}
```

Для этого можно использовать `c.ShouldBindBodyWith`.

```go
func SomeHandler(c *gin.Context) {
  objA := formA{}
  objB := formB{}
  // This reads c.Request.Body and stores the result into the context.
  if errA := c.ShouldBindBodyWith(&objA, binding.JSON); errA == nil {
    c.String(http.StatusOK, `the body should be formA`)
  // At this time, it reuses body stored in the context.
  } else if errB := c.ShouldBindBodyWith(&objB, binding.JSON); errB == nil {
    c.String(http.StatusOK, `the body should be formB JSON`)
  // And it can accepts other formats
  } else if errB2 := c.ShouldBindBodyWith(&objB, binding.XML); errB2 == nil {
    c.String(http.StatusOK, `the body should be formB XML`)
  } else {
    ...
  }
}
```

* `c.ShouldBindBodyWith` сохраняет тело в контексте перед привязкой. Это
небольшое влияние на производительность, поэтому не стоит использовать этот метод, если вы
достаточно вызвать привязку сразу.
* Эта возможность необходима только для некоторых форматов - `JSON`, `XML`, `MsgPack`,
`ProtoBuf`. Для других форматов, `Query`, `Form`, `FormPost`, `FormMultipart`,
могут быть вызваны `c.ShouldBind()` многократно без ущерба для
производительности (см. [#1341](https://github.com/gin-gonic/gin/pull/1341)).

