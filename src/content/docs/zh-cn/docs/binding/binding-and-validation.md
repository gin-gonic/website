---
title: "模型绑定和验证"
sidebar:
  order: 1
---

要将请求体绑定到类型中，请使用模型绑定。我们目前支持绑定 JSON、XML、YAML 和标准表单值（foo=bar&boo=baz）。

Gin 使用 [**go-playground/validator/v10**](https://github.com/go-playground/validator) 进行验证。查看标签用法的完整文档请点击[这里](https://pkg.go.dev/github.com/go-playground/validator/v10#hdr-Baked_In_Validators_and_Tags)。

请注意，你需要在所有要绑定的字段上设置相应的绑定标签。例如，从 JSON 绑定时，设置 `json:"fieldname"`。

此外，Gin 提供了两组绑定方法：
- **类型** - Must bind
  - **方法** - `Bind`、`BindJSON`、`BindXML`、`BindQuery`、`BindYAML`
  - **行为** - 这些方法底层使用 `MustBindWith`。如果存在绑定错误，请求将使用 `c.AbortWithError(400, err).SetType(ErrorTypeBind)` 中止。这会将响应状态码设置为 400，并将 `Content-Type` 头设置为 `text/plain; charset=utf-8`。注意，如果你在此之后尝试设置响应码，将会出现警告 `[GIN-debug] [WARNING] Headers were already written. Wanted to override status code 400 with 422`。如果你希望更好地控制行为，请考虑使用 `ShouldBind` 等效方法。
- **类型** - Should bind
  - **方法** - `ShouldBind`、`ShouldBindJSON`、`ShouldBindXML`、`ShouldBindQuery`、`ShouldBindYAML`
  - **行为** - 这些方法底层使用 `ShouldBindWith`。如果存在绑定错误，错误会被返回，由开发者负责适当地处理请求和错误。

使用 Bind 方法时，Gin 会尝试根据 Content-Type 头来推断绑定器。如果你确定要绑定的内容类型，可以使用 `MustBindWith` 或 `ShouldBindWith`。

你还可以指定特定字段为必填。如果一个字段标记了 `binding:"required"` 并且在绑定时值为空，将返回错误。

如果结构体的某个字段本身也是结构体（嵌套结构体），该结构体的字段也需要标记 `binding:"required"` 才能正确验证。

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

### 示例请求

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

### 跳过验证

当使用上面的 `curl` 命令运行上述示例时，会返回错误。因为示例中对 `Password` 使用了 `binding:"required"`。如果对 `Password` 使用 `binding:"-"`，则再次运行上述示例时将不会返回错误。

## 另请参阅

- [自定义验证器](/zh-cn/docs/binding/custom-validators/)
- [绑定查询字符串或 POST 数据](/zh-cn/docs/binding/bind-query-or-post/)
