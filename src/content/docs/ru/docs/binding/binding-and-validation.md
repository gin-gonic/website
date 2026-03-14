---
title: "Привязка модели и валидация"
sidebar:
  order: 1
---

Для привязки тела запроса к типу используйте привязку модели. В настоящее время поддерживается привязка JSON, XML, YAML и стандартных значений форм (foo=bar&boo=baz).

Gin использует [**go-playground/validator/v10**](https://github.com/go-playground/validator) для валидации. Полную документацию по использованию тегов можно найти [здесь](https://pkg.go.dev/github.com/go-playground/validator/v10#hdr-Baked_In_Validators_and_Tags).

Обратите внимание, что вам нужно установить соответствующий тег привязки для всех полей, которые вы хотите привязать. Например, при привязке из JSON установите `json:"fieldname"`.

Также Gin предоставляет два набора методов привязки:
- **Тип** - Must bind (обязательная привязка)
  - **Методы** - `Bind`, `BindJSON`, `BindXML`, `BindQuery`, `BindYAML`
  - **Поведение** - Эти методы используют `MustBindWith` под капотом. Если возникает ошибка привязки, запрос прерывается с помощью `c.AbortWithError(400, err).SetType(ErrorTypeBind)`. Это устанавливает код ответа 400, а заголовок `Content-Type` — `text/plain; charset=utf-8`. Обратите внимание: если вы попытаетесь установить код ответа после этого, появится предупреждение `[GIN-debug] [WARNING] Headers were already written. Wanted to override status code 400 with 422`. Если вам нужен больший контроль над поведением, используйте эквивалентный метод `ShouldBind`.
- **Тип** - Should bind (мягкая привязка)
  - **Методы** - `ShouldBind`, `ShouldBindJSON`, `ShouldBindXML`, `ShouldBindQuery`, `ShouldBindYAML`
  - **Поведение** - Эти методы используют `ShouldBindWith` под капотом. Если возникает ошибка привязки, ошибка возвращается, и разработчик несёт ответственность за правильную обработку запроса и ошибки.

При использовании метода Bind Gin пытается определить привязчик в зависимости от заголовка Content-Type. Если вы точно знаете, что привязываете, можете использовать `MustBindWith` или `ShouldBindWith`.

Вы также можете указать, что определённые поля являются обязательными. Если поле помечено `binding:"required"` и имеет пустое значение при привязке, будет возвращена ошибка.

Если одно из полей структуры само является структурой (вложенная структура), поля этой структуры также должны быть помечены `binding:"required"` для корректной валидации.

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

### Пропуск валидации

При запуске приведённого выше примера с указанной командой `curl` возвращается ошибка. Это происходит потому, что в примере используется `binding:"required"` для `Password`. Если использовать `binding:"-"` для `Password`, то ошибка не будет возвращена при повторном запуске примера.

## Смотрите также

- [Пользовательские валидаторы](/ru/docs/binding/custom-validators/)
- [Привязка строки запроса или POST-данных](/ru/docs/binding/bind-query-or-post/)
