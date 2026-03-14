---
title: "커스텀 구조체 태그로 폼 데이터 바인딩"
sidebar:
  order: 14
---

커스텀 바인딩을 구현하여 커스텀 구조체 태그로 폼 데이터 요청을 바인딩할 수 있습니다.

```go
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

// FormA는 태그를 수정할 수 없는 외부 타입입니다
type FormA struct {
  FieldA string `url:"field_a"`
}

func ListHandler(s *Service) func(ctx *gin.Context) {
  return func(ctx *gin.Context) {
    var urlBinding = customerBinding{}
    var opt FormA
    err := ctx.MustBindWith(&opt, urlBinding)
    if err != nil {
      // 오류 처리
    }
    // opt.FieldA 사용
  }
}
```
