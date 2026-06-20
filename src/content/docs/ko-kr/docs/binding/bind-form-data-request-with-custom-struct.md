---
title: "커스텀 구조체로 폼 데이터 요청 바인딩"
sidebar:
  order: 12
---

Gin은 폼 데이터를 중첩된 구조체에 자동으로 바인딩할 수 있습니다. 데이터 모델이 더 작은 구조체로 구성되어 있을 때 -- 임베디드 필드, 포인터 필드 또는 익명 인라인 구조체 -- Gin은 구조체 계층을 순회하며 각 `form` 태그를 해당 쿼리 매개변수 또는 폼 필드에 매핑합니다.

이는 많은 필드를 가진 하나의 평면 구조체를 정의하는 대신 복잡한 폼을 재사용 가능한 하위 구조체로 구성하는 데 유용합니다.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

type StructA struct {
  FieldA string `form:"field_a"`
}

type StructB struct {
  NestedStruct StructA
  FieldB       string `form:"field_b"`
}

type StructC struct {
  NestedStructPointer *StructA
  FieldC              string `form:"field_c"`
}

type StructD struct {
  NestedAnonyStruct struct {
    FieldX string `form:"field_x"`
  }
  FieldD string `form:"field_d"`
}

func main() {
  router := gin.Default()

  router.GET("/getb", func(c *gin.Context) {
    var b StructB
    c.Bind(&b)
    c.JSON(http.StatusOK, gin.H{
      "a": b.NestedStruct,
      "b": b.FieldB,
    })
  })

  router.GET("/getc", func(c *gin.Context) {
    var b StructC
    c.Bind(&b)
    c.JSON(http.StatusOK, gin.H{
      "a": b.NestedStructPointer,
      "c": b.FieldC,
    })
  })

  router.GET("/getd", func(c *gin.Context) {
    var b StructD
    c.Bind(&b)
    c.JSON(http.StatusOK, gin.H{
      "x": b.NestedAnonyStruct,
      "d": b.FieldD,
    })
  })

  router.Run(":8080")
}
```

## 테스트

```sh
# Nested struct -- fields from StructA are bound alongside StructB's own fields
curl "http://localhost:8080/getb?field_a=hello&field_b=world"
# Output: {"a":{"FieldA":"hello"},"b":"world"}

# Nested struct pointer -- works the same way, Gin allocates the pointer automatically
curl "http://localhost:8080/getc?field_a=hello&field_c=world"
# Output: {"a":{"FieldA":"hello"},"c":"world"}

# Anonymous inline struct -- fields are bound by their form tags as usual
curl "http://localhost:8080/getd?field_x=hello&field_d=world"
# Output: {"d":"world","x":{"FieldX":"hello"}}
```

:::note
중첩된 구조체, 중첩된 구조체 포인터, 익명 인라인 구조체 세 가지 패턴 모두 동일한 평면 쿼리 매개변수를 사용하여 바인딩됩니다. Gin은 매개변수 이름에 접두사나 중첩 규칙을 요구하지 않습니다.
:::

## 참고

- [바인딩과 유효성 검사](/ko-kr/docs/binding/binding-and-validation/)
- [커스텀 구조체 태그로 폼 데이터 바인딩](/ko-kr/docs/binding/bind-form-data-custom-struct-tag/)
