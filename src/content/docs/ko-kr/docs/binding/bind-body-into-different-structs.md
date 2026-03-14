---
title: "바디를 다른 구조체에 바인딩 시도"
sidebar:
  order: 13
---

요청 바디를 바인딩하는 일반 메서드는 `c.Request.Body`를 소비하며 여러 번 호출할 수 없습니다.

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
  // 이 c.ShouldBind는 c.Request.Body를 소비하며 재사용할 수 없습니다.
  if errA := c.ShouldBind(&objA); errA == nil {
    c.String(http.StatusOK, `the body should be formA`)
  // c.Request.Body가 이제 EOF이므로 항상 오류가 발생합니다.
  } else if errB := c.ShouldBind(&objB); errB == nil {
    c.String(http.StatusOK, `the body should be formB`)
  } else {
    ...
  }
}
```

이를 위해 `c.ShouldBindBodyWith`를 사용할 수 있습니다.

```go
func SomeHandler(c *gin.Context) {
  objA := formA{}
  objB := formB{}
  // c.Request.Body를 읽고 결과를 컨텍스트에 저장합니다.
  if errA := c.ShouldBindBodyWith(&objA, binding.JSON); errA == nil {
    c.String(http.StatusOK, `the body should be formA`)
  // 이 시점에서 컨텍스트에 저장된 바디를 재사용합니다.
  } else if errB := c.ShouldBindBodyWith(&objB, binding.JSON); errB == nil {
    c.String(http.StatusOK, `the body should be formB JSON`)
  // 다른 형식도 사용할 수 있습니다
  } else if errB2 := c.ShouldBindBodyWith(&objB, binding.XML); errB2 == nil {
    c.String(http.StatusOK, `the body should be formB XML`)
  } else {
    ...
  }
}
```

* `c.ShouldBindBodyWith`는 바인딩 전에 바디를 컨텍스트에 저장합니다. 이는 성능에 약간의 영향을 미치므로, 한 번만 바인딩하면 되는 경우에는 이 메서드를 사용하지 않는 것이 좋습니다.
* 이 기능은 일부 형식에서만 필요합니다 -- `JSON`, `XML`, `MsgPack`, `ProtoBuf`. 다른 형식인 `Query`, `Form`, `FormPost`, `FormMultipart`는 성능 저하 없이 `c.ShouldBind()`를 여러 번 호출할 수 있습니다 ([#1341](https://github.com/gin-gonic/gin/pull/1341) 참조).
