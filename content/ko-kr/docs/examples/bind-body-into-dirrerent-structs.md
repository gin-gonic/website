---
title: "body를 다른 구조체에 바인드 하기"
draft: false
---

일반적인 body 바인딩 메소드는 `c.Request.Body`를 소모합니다.
따라서 이러한 메소드들은 여러번 호출할 수 없습니다.

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
  // 아래의 c.ShouldBind는 c.Request.Body를 소모하며, 재이용이 불가능합니다.
  if errA := c.ShouldBind(&objA); errA == nil {
    c.String(http.StatusOK, `the body should be formA`)
  // c.Request.Body가 EOF 이므로 에러가 발생합니다.
  } else if errB := c.ShouldBind(&objB); errB == nil {
    c.String(http.StatusOK, `the body should be formB`)
  } else {
    ...
  }
}
```

이를 위해 `c.ShouldBindBodyWith`를 사용하여 해결 할 수 있습니다.

```go
func SomeHandler(c *gin.Context) {
  objA := formA{}
  objB := formB{}
  // c.Request.Body를 읽고 context에 결과를 저장합니다.
  if errA := c.ShouldBindBodyWith(&objA, binding.JSON); errA == nil {
    c.String(http.StatusOK, `the body should be formA`)
  // context에 저장된 body를 읽어 재이용 합니다.
  } else if errB := c.ShouldBindBodyWith(&objB, binding.JSON); errB == nil {
    c.String(http.StatusOK, `the body should be formB JSON`)
  // 다른 형식을 사용할 수도 있습니다.
  } else if errB2 := c.ShouldBindBodyWith(&objB, binding.XML); errB2 == nil {
    c.String(http.StatusOK, `the body should be formB XML`)
  } else {
    ...
  }
}
```

* `c.ShouldBindBodyWith`는 바인딩 전에 context에 body를 저장합니다. 이것은 성능에 약간의
영향을 미치기 때문에 한번의 바인딩으로 충분하다면, 이 메소드를 사용하지 않는 것이 좋습니다.
* 이 기능은 `JSON`, `XML`, `MsgPack`,`ProtoBuf` 형식에만 필요합니다.
`Query`, `Form`, `FormPost`, `FormMultipart`와 같은 다른 형식은 성능에 영향을 주지 않고
`c.ShouldBind()`에 의해 여러번 호출 될 수 있습니다. (이슈 참고[#1341](https://github.com/gin-gonic/gin/pull/1341)).

