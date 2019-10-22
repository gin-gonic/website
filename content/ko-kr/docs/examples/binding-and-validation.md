---
title: "모델 바인딩과 유효성 검사"
draft: false
---

리퀘스트 바디를 바인딩하려면 모델 바인딩을 사용하세요. 현재 JSON, XML, YAML 및 표준 form values (foo=bar&boo=baz) 바인딩을 지원합니다.

Gin은 유효성 검사에 [**go-playground/validator.v8**](https://github.com/go-playground/validator)을 사용합니다. 태그 사용법에 대한 전체 문서는 [여기](http://godoc.org/gopkg.in/go-playground/validator.v8#hdr-Baked_In_Validators_and_Tags)를 확인하세요.

바인딩 하려는 모든 항목에 대해 해당 바인딩 태그를 설정해야 합니다. 예를 들어, JSON을 바인딩 하려면 `json:"fieldname"`을 설정하세요.

또한, Gin은 바인딩을 위해 2가지 방법을 제공합니다:

- **타입** - Must bind
  - **메소드** - `Bind`, `BindJSON`, `BindXML`, `BindQuery`, `BindYAML`
  - **동작** - 이 메소드들은 내부에서 `MustBindWith`를 사용합니다. 바인딩 에러가 있는 경우, 리퀘스트는 `c.AbortWithError(400, err).SetType(ErrorTypeBind)`와 함께 중단됩니다. 응답코드는 400으로 설정되며, `Content-Type`헤더에는 `text/plain; charset=utf-8`이 설정됩니다. 이 이후에 응답코드를 설정하려고 하면 `[GIN-debug] [WARNING] Headers were already written. Wanted to override status code 400 with 422` 경고가 발생합니다. 동작을 더 상세하게 제어하고 싶다면 `ShouldBind`와 같은 메소드를 사용하세요.
- **타입** - Should bind
  - **메소드** - `ShouldBind`, `ShouldBindJSON`, `ShouldBindXML`, `ShouldBindQuery`, `ShouldBindYAML`
  - **동작** - 이 메소드들은 내부에서 `ShouldBindWith`를 사용합니다. 바인딩 에러가 있는 경우, 에러를 적절히 처리하고 반환하는 것은 개발자의 몫입니다.

Gin은 Bind-method를 사용할 때 Content-Type 헤더에 따라 바인더를 유추합니다. 바인딩하는 내용이 확실한 경우 `MustBindWith` 또는 `ShouldBindWith`를 사용할 수 있습니다.

특정 항목을 필수로 지정할 수도 있습니다. 항목이 `binding:"required"`로 설정되어 있으나, 바인딩 할 값이 비어 있다면 에러가 반환됩니다.

```go
// JSON 바인딩
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
	//	<?xml version="1.0" encoding="UTF-8"?>
	//	<root>
	//		<user>user</user>
	//		<password>123</password>
	//	</root>)
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

	// HTML form 바인딩 예제 (user=manu&password=123)
	router.POST("/loginForm", func(c *gin.Context) {
		var form Login
		// content-type 헤더에 따라 사용할 바인더를 유추합니다.
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

	// 서버가 실행 되고 0.0.0.0:8080 에서 요청을 기다립니다.
	router.Run(":8080")
}
```

### 요청문 예제

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

위의 `curl` 명령어를 실행하면, 에러가 반환됩니다. 이 예제에서는 `Password`에 `binding:"required"`가 설정되어 있기 때문입니다. `Password`에 `binding:"-"`을 설정한 후 실행하면 에러가 발생하지 않습니다.
