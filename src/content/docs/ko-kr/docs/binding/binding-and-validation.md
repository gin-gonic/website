---
title: "모델 바인딩 및 유효성 검사"
sidebar:
  order: 1
---

요청 바디를 타입에 바인딩하려면 모델 바인딩을 사용합니다. 현재 JSON, XML, YAML 및 표준 폼 값(foo=bar&boo=baz)의 바인딩을 지원합니다.

Gin은 유효성 검사를 위해 [**go-playground/validator/v10**](https://github.com/go-playground/validator)을 사용합니다. 태그 사용에 대한 전체 문서는 [여기](https://pkg.go.dev/github.com/go-playground/validator/v10#hdr-Baked_In_Validators_and_Tags)에서 확인하세요.

바인딩하려는 모든 필드에 해당 바인딩 태그를 설정해야 합니다. 예를 들어, JSON에서 바인딩할 때 `json:"fieldname"`을 설정합니다.

또한, Gin은 바인딩을 위한 두 가지 메서드 세트를 제공합니다:
- **타입** - Must bind
  - **메서드** - `Bind`, `BindJSON`, `BindXML`, `BindQuery`, `BindYAML`
  - **동작** - 이 메서드들은 내부적으로 `MustBindWith`를 사용합니다. 바인딩 오류가 있으면, `c.AbortWithError(400, err).SetType(ErrorTypeBind)`로 요청이 중단됩니다. 응답 상태 코드가 400으로 설정되고 `Content-Type` 헤더가 `text/plain; charset=utf-8`로 설정됩니다. 이 후에 응답 코드를 설정하려고 하면 `[GIN-debug] [WARNING] Headers were already written. Wanted to override status code 400 with 422`라는 경고가 발생합니다. 동작에 대한 더 많은 제어를 원하면 `ShouldBind` 해당 메서드를 사용하는 것을 고려하세요.
- **타입** - Should bind
  - **메서드** - `ShouldBind`, `ShouldBindJSON`, `ShouldBindXML`, `ShouldBindQuery`, `ShouldBindYAML`
  - **동작** - 이 메서드들은 내부적으로 `ShouldBindWith`를 사용합니다. 바인딩 오류가 있으면 오류가 반환되며, 요청과 오류를 적절하게 처리하는 것은 개발자의 책임입니다.

Bind 메서드를 사용할 때, Gin은 Content-Type 헤더에 따라 바인더를 추론하려고 합니다. 바인딩 대상이 확실하다면, `MustBindWith` 또는 `ShouldBindWith`를 사용할 수 있습니다.

특정 필드를 필수로 지정할 수도 있습니다. 필드에 `binding:"required"` 데코레이터가 있고 바인딩 시 빈 값이면 오류가 반환됩니다.

구조체 필드 중 하나가 그 자체가 구조체(중첩 구조체)인 경우, 올바르게 유효성을 검사하려면 해당 구조체의 필드에도 `binding:"required"` 데코레이터가 필요합니다.

```go
// JSON에서 바인딩
type Login struct {
  User     string `form:"user" json:"user" xml:"user"  binding:"required"`
  Password string `form:"password" json:"password" xml:"password" binding:"required"`
}

func main() {
  router := gin.Default()

  // JSON 바인딩 예제 ({"user": "manu", "password": "123"})
  router.POST("/loginJSON", func(c *gin.Context) {
    var json Login
    if err := c.ShouldBindJSON(&json); err != nil {
      c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      return
    }

    if json.User != "manu" || json.Password != "123" {
      c.JSON(http.StatusUnauthorized, gin.H{"status": "unauthorized"})
      return
    }

    c.JSON(http.StatusOK, gin.H{"status": "you are logged in"})
  })

  // XML 바인딩 예제 (
  //  <?xml version="1.0" encoding="UTF-8"?>
  //  <root>
  //    <user>manu</user>
  //    <password>123</password>
  //  </root>)
  router.POST("/loginXML", func(c *gin.Context) {
    var xml Login
    if err := c.ShouldBindXML(&xml); err != nil {
      c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      return
    }

    if xml.User != "manu" || xml.Password != "123" {
      c.JSON(http.StatusUnauthorized, gin.H{"status": "unauthorized"})
      return
    }

    c.JSON(http.StatusOK, gin.H{"status": "you are logged in"})
  })

  // HTML 폼 바인딩 예제 (user=manu&password=123)
  router.POST("/loginForm", func(c *gin.Context) {
    var form Login
    // content-type 헤더에 따라 사용할 바인더를 추론합니다.
    if err := c.ShouldBind(&form); err != nil {
      c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      return
    }

    if form.User != "manu" || form.Password != "123" {
      c.JSON(http.StatusUnauthorized, gin.H{"status": "unauthorized"})
      return
    }

    c.JSON(http.StatusOK, gin.H{"status": "you are logged in"})
  })

  // 0.0.0.0:8080에서 수신 대기 및 서비스
  router.Run(":8080")
}
```

### 샘플 요청

```sh
$ curl -v -X POST \
  http://localhost:8080/loginJSON \
  -H 'content-type: application/json' \
  -d '{ "user": "manu" }'
> POST /loginJSON HTTP/1.1
> Host: localhost:8080
> User-Agent: curl/7.51.0
> Accept: */*
> content-type: application/json
> Content-Length: 18
>
* upload completely sent off: 18 out of 18 bytes
< HTTP/1.1 400 Bad Request
< Content-Type: application/json; charset=utf-8
< Date: Fri, 04 Aug 2017 03:51:31 GMT
< Content-Length: 100
<
{"error":"Key: 'Login.Password' Error:Field validation for 'Password' failed on the 'required' tag"}
```

### 유효성 검사 건너뛰기

위의 `curl` 명령으로 위의 예제를 실행하면 오류가 반환됩니다. 예제에서 `Password`에 `binding:"required"`를 사용하기 때문입니다. `Password`에 `binding:"-"`을 사용하면, 위의 예제를 다시 실행할 때 오류가 반환되지 않습니다.

## 참고

- [커스텀 유효성 검사기](/ko-kr/docs/binding/custom-validators/)
- [쿼리 또는 POST 데이터 바인딩](/ko-kr/docs/binding/bind-query-or-post/)
