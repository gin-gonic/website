---
title: "Model binding e validação"
sidebar:
  order: 1
---

Para vincular o corpo de uma requisição a um tipo, use o model binding. Atualmente suportamos binding de JSON, XML, YAML e valores de formulário padrão (foo=bar&boo=baz).

O Gin usa [**go-playground/validator/v10**](https://github.com/go-playground/validator) para validação. Confira a documentação completa sobre o uso de tags [aqui](https://pkg.go.dev/github.com/go-playground/validator/v10#hdr-Baked_In_Validators_and_Tags).

Note que você precisa definir a tag de binding correspondente em todos os campos que deseja vincular. Por exemplo, ao vincular a partir de JSON, defina `json:"fieldname"`.

Além disso, o Gin oferece dois conjuntos de métodos para binding:
- **Tipo** - Must bind
  - **Métodos** - `Bind`, `BindJSON`, `BindXML`, `BindQuery`, `BindYAML`
  - **Comportamento** - Esses métodos usam `MustBindWith` internamente. Se houver um erro de binding, a requisição é abortada com `c.AbortWithError(400, err).SetType(ErrorTypeBind)`. Isso define o código de status da resposta como 400 e o header `Content-Type` como `text/plain; charset=utf-8`. Note que se você tentar definir o código de resposta após isso, resultará em um aviso `[GIN-debug] [WARNING] Headers were already written. Wanted to override status code 400 with 422`. Se você deseja ter maior controle sobre o comportamento, considere usar o método equivalente `ShouldBind`.
- **Tipo** - Should bind
  - **Métodos** - `ShouldBind`, `ShouldBindJSON`, `ShouldBindXML`, `ShouldBindQuery`, `ShouldBindYAML`
  - **Comportamento** - Esses métodos usam `ShouldBindWith` internamente. Se houver um erro de binding, o erro é retornado e é responsabilidade do desenvolvedor tratar a requisição e o erro adequadamente.

Ao usar o método Bind, o Gin tenta inferir o binder dependendo do header Content-Type. Se você tem certeza do que está vinculando, pode usar `MustBindWith` ou `ShouldBindWith`.

Você também pode especificar que campos específicos são obrigatórios. Se um campo estiver decorado com `binding:"required"` e tiver um valor vazio durante o binding, um erro será retornado.

Se um dos campos da struct for ele próprio uma struct (struct aninhada), os campos dessa struct também precisarão ser decorados com `binding:"required"` para validar corretamente.

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

### Exemplo de requisição

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

### Pular validação

Ao executar o exemplo acima usando o comando `curl` acima, ele retorna erro. Porque o exemplo usa `binding:"required"` para `Password`. Se usar `binding:"-"` para `Password`, então não retornará erro ao executar o exemplo acima novamente.

## Veja também

- [Validadores customizados](/pt/docs/binding/custom-validators/)
- [Vincular query ou dados post](/pt/docs/binding/bind-query-or-post/)
