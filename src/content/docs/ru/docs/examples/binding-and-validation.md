---
title: "Связывание и проверка моделей"
черновик: false
---

Чтобы привязать тело запроса к типу, используйте привязку к модели. В настоящее время мы поддерживаем привязку JSON, XML, YAML и стандартных значений формы (foo=bar&boo=baz).

Для валидации Gin использует [**go-playground/validator/v10**](https://github.com/go-playground/validator). Ознакомьтесь с полной документацией по использованию тегов [здесь](https://pkg.go.dev/github.com/go-playground/validator/v10#hdr-Baked_In_Validators_and_Tags).

Обратите внимание, что вам необходимо установить соответствующий тег привязки для всех полей, которые вы хотите привязать. Например, при привязке из JSON установите `json: "fieldname"`.

Кроме того, Gin предоставляет два набора методов для привязки:
- **Type** - Must bind
  - **Методы** - `Bind`, `BindJSON`, `BindXML`, `BindQuery`, `BindYAML`
  - **Поведение** - Эти методы используют `MustBindWith` под капотом. Если произошла ошибка связывания, запрос прерывается с помощью `c.AbortWithError(400, err).SetType(ErrorTypeBind)`. При этом код состояния ответа принимает значение 400, а заголовок `Content-Type` устанавливается на `text/plain; charset=utf-8`. Обратите внимание, что если вы попытаетесь установить код ответа после этого, то это приведет к предупреждению `[GIN-debug] [WARNING] Заголовки уже были записаны. Хотелось отменить код статуса 400 на 422`. Если вы хотите получить больший контроль над поведением, используйте эквивалентный метод `ShouldBind`.
- **Тип** - Should bind
  - **Методы** - `ShouldBind`, `ShouldBindJSON`, `ShouldBindXML`, `ShouldBindQuery`, `ShouldBindYAML`
  - **Поведение** - Эти методы используют `ShouldBindWith` под капотом. Если произошла ошибка связывания, возвращается ошибка, и разработчик обязан обработать запрос и ошибку соответствующим образом.

При использовании Bind-метода Gin пытается определить связующее звено в зависимости от заголовка Content-Type. Если вы уверены, что именно вы связываете, вы можете использовать `MustBindWith` или `ShouldBindWith`.

Вы также можете указать, что определенные поля являются обязательными. Если поле украшено `binding: "required"` и при привязке имеет пустое значение, будет возвращена ошибка.

```go
// Binding from JSON
type Login struct {
	User     string `form:"user" json:"user" xml:"user"  binding:"required"`
	Password string `form:"password" json:"password" xml:"password" binding:"required"`
}

func main() {
	router := gin.Default()

	// Example for binding JSON ({"user": "manu", "password": "123"})
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

	// Example for binding XML (
	//	<?xml version="1.0" encoding="UTF-8"?>
	//	<root>
	//		<user>manu</user>
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

	// Example for binding a HTML form (user=manu&password=123)
	router.POST("/loginForm", func(c *gin.Context) {
		var form Login
		// This will infer what binder to use depending on the content-type header.
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

	// Listen and serve on 0.0.0.0:8080
	router.Run(":8080")
}
```

### Пример запроса

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

### Пропустить валидацию

При выполнении приведенного выше примера с помощью указанной выше команды `curl` возвращается ошибка. Потому что в примере используется `привязка: "required"` для `Password`. Если использовать `binding:"-"` для `Password`, то при повторном запуске приведенного выше примера ошибка не возникнет.
