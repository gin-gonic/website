---
title: "바인딩"
sidebar:
  order: 4
---

Gin은 요청 데이터를 Go 구조체로 파싱하고 자동으로 유효성을 검사하는 강력한 바인딩 시스템을 제공합니다. 수동으로 `c.PostForm()`을 호출하거나 `c.Request.Body`를 읽는 대신, 태그가 있는 구조체를 정의하고 Gin이 작업을 수행하도록 합니다.

## Bind vs ShouldBind

Gin은 두 가지 계열의 바인딩 메서드를 제공합니다:

| 메서드 | 오류 시 | 사용 시기 |
|--------|----------|----------|
| `c.Bind`, `c.BindJSON` 등 | 자동으로 `c.AbortWithError(400, err)` 호출 | Gin이 오류 응답을 처리하게 하고 싶을 때 |
| `c.ShouldBind`, `c.ShouldBindJSON` 등 | 직접 처리할 오류 반환 | 커스텀 오류 응답을 원할 때 |

대부분의 경우, 오류 처리에 대한 더 많은 제어를 위해 **`ShouldBind`를 사용하는 것을 권장합니다**.

## 간단한 예제

```go
type LoginForm struct {
  User     string `form:"user" binding:"required"`
  Password string `form:"password" binding:"required"`
}

func main() {
  router := gin.Default()

  router.POST("/login", func(c *gin.Context) {
    var form LoginForm
    // ShouldBind는 Content-Type을 확인하여 자동으로 바인딩 엔진을 선택합니다
    if err := c.ShouldBind(&form); err != nil {
      c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      return
    }
    c.JSON(http.StatusOK, gin.H{"status": "logged in"})
  })

  router.Run(":8080")
}
```

## 지원 형식

Gin은 다양한 소스에서 데이터를 바인딩할 수 있습니다: **JSON**, **XML**, **YAML**, **TOML**, **폼 데이터** (URL 인코딩 및 multipart), **쿼리 문자열**, **URI 매개변수**, **헤더**. 적절한 구조체 태그(`json`, `xml`, `yaml`, `form`, `uri`, `header`)를 사용하여 필드를 매핑합니다. 유효성 검사 규칙은 `binding` 태그에 들어가며 [go-playground/validator](https://github.com/go-playground/validator) 구문을 사용합니다.

## 이 섹션의 내용

- [**모델 바인딩 및 유효성 검사**](./model-binding-and-validation/) -- 핵심 바인딩 개념과 유효성 검사 규칙
- [**커스텀 유효성 검사기**](./custom-validators/) -- 자체 유효성 검사 함수 등록
- [**쿼리 문자열 또는 POST 데이터 바인딩**](./bind-query-or-post/) -- 쿼리 문자열과 폼 바디에서 바인딩
- [**URI 바인딩**](./bind-uri/) -- 경로 매개변수를 구조체에 바인딩
- [**헤더 바인딩**](./bind-header/) -- HTTP 헤더를 구조체에 바인딩
- [**기본값**](./default-value/) -- 누락된 필드에 대한 대체 값 설정
- [**컬렉션 형식**](./collection-format/) -- 배열 쿼리 매개변수 처리
- [**커스텀 언마셜러**](./custom-unmarshaler/) -- 커스텀 역직렬화 로직 구현
- [**HTML 체크박스 바인딩**](./bind-html-checkboxes/) -- 체크박스 폼 입력 처리
- [**Multipart/URL 인코딩 바인딩**](./multipart-urlencoded-binding/) -- multipart 폼 데이터 바인딩
- [**커스텀 구조체 태그**](./custom-struct-tag/) -- 필드 매핑을 위한 커스텀 구조체 태그 사용
- [**바디를 다른 구조체에 바인딩 시도**](./bind-body-into-different-structs/) -- 요청 바디를 여러 번 파싱
