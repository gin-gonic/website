---
title: "바디를 다른 구조체에 바인딩 시도"
sidebar:
  order: 13
---

`c.ShouldBind`과 같은 표준 바인딩 메서드는 `io.ReadCloser`인 `c.Request.Body`를 소비합니다. 한 번 읽으면 다시 읽을 수 없습니다. 이는 동일한 요청에서 다른 구조체 형태로 `c.ShouldBind`를 여러 번 호출할 수 없다는 것을 의미합니다.

이 문제를 해결하려면 `c.ShouldBindBodyWith`를 사용하세요. 바디를 한 번 읽고 컨텍스트에 저장하여 이후 바인딩에서 캐시된 바디를 재사용할 수 있습니다.

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

## 테스트

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
`c.ShouldBindBodyWith`는 바인딩하기 전에 바디를 컨텍스트에 저장합니다. 이로 인해 약간의 성능 영향이 있으므로 바디를 두 번 이상 바인딩해야 할 때만 사용하세요. `Query`, `Form`, `FormPost`, `FormMultipart`와 같이 바디를 읽지 않는 형식의 경우 문제 없이 `c.ShouldBind()`를 여러 번 호출할 수 있습니다.
:::

## 참고

- [바인딩과 유효성 검사](/ko-kr/docs/binding/binding-and-validation/)
- [쿼리 문자열 또는 POST 데이터 바인딩](/ko-kr/docs/binding/bind-query-or-post/)
