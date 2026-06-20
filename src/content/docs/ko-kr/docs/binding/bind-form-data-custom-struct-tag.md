---
title: "커스텀 구조체 태그로 폼 데이터 바인딩"
sidebar:
  order: 14
---

기본적으로 Gin은 `form` 구조체 태그를 사용하여 폼 데이터를 바인딩합니다. 다른 태그를 사용하는 구조체를 바인딩해야 할 때 -- 예를 들어 수정할 수 없는 외부 타입 -- 사용자 정의 태그에서 읽는 커스텀 바인딩을 생성할 수 있습니다.

이는 `form` 대신 `url`, `query` 또는 기타 커스텀 이름의 태그를 사용하는 서드파티 라이브러리와 통합할 때 유용합니다.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
  "github.com/gin-gonic/gin/binding"
)

const (
  customerTag   = "url"
  defaultMemory = 32 << 20
)

type customerBinding struct{}

func (customerBinding) Name() string {
  return "form"
}

func (customerBinding) Bind(req *http.Request, obj any) error {
  if err := req.ParseForm(); err != nil {
    return err
  }
  if err := req.ParseMultipartForm(defaultMemory); err != nil {
    if err != http.ErrNotMultipart {
      return err
    }
  }
  if err := binding.MapFormWithTag(obj, req.Form, customerTag); err != nil {
    return err
  }
  return validate(obj)
}

func validate(obj any) error {
  if binding.Validator == nil {
    return nil
  }
  return binding.Validator.ValidateStruct(obj)
}

// FormA is an external type that we can't modify its tag
type FormA struct {
  FieldA string `url:"field_a"`
}

func main() {
  router := gin.Default()

  router.GET("/list", func(c *gin.Context) {
    var urlBinding = customerBinding{}
    var opt FormA
    if err := c.MustBindWith(&opt, urlBinding); err != nil {
      return
    }
    c.JSON(http.StatusOK, gin.H{"field_a": opt.FieldA})
  })

  router.Run(":8080")
}
```

## 테스트

```sh
# The custom binding reads from the "url" struct tag instead of "form"
curl "http://localhost:8080/list?field_a=hello"
# Output: {"field_a":"hello"}

# Missing parameter -- empty string
curl "http://localhost:8080/list"
# Output: {"field_a":""}
```

:::note
커스텀 바인딩은 `binding.Binding` 인터페이스를 구현하며, `Name() string` 메서드와 `Bind(*http.Request, any) error` 메서드가 필요합니다. `binding.MapFormWithTag` 헬퍼가 커스텀 태그를 사용하여 폼 값을 구조체 필드에 매핑하는 실제 작업을 수행합니다.
:::

## 참고

- [바인딩과 유효성 검사](/ko-kr/docs/binding/binding-and-validation/)
- [커스텀 구조체로 폼 데이터 요청 바인딩](/ko-kr/docs/binding/bind-form-data-request-with-custom-struct/)
