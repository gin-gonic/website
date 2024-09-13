---
title: "Vinculação de Modelo e Validação"

---

Para vincular uma corpo de requisição à um tipo, use a vinculação de modelo. Nós atualmente suportamos a vinculação de JSON, XML, YAML e valores de formulário padrão (foo=bar&boo=baz).

A Gin usa [**`go-playground/validator/v10`**](https://github.com/go-playground/validator) para a validação. Consulte a documentação completa sobre o uso de marcadores [nesta ligação](https://pkg.go.dev/github.com/go-playground/validator/v10#hdr-Baked_In_Validators_and_Tags).

Nota que precisas de definir o marcador da vinculação correspondente em todos os campos que quiseres vincular. Por exemplo, quando estiveres a vincular a partir de JSON, defina `json:"fieldname"`.

Além disto, a Gin fornece dois conjuntos de métodos para vinculação:

- **Tipo** - Deve vincular
	- **Métodos** - `Bind`, `BindJSON`, `BindXML`, `BindQuery`, `BindYAML`
	- **Comportamento** - Estes métodos usam `MustBindWith` nos bastidores. Se houver um erro de vinculação, a requisição é abortada com `c.AbortWithError(400, err).SetType(ErrorTypeBind)`. Isto define o código do estado da resposta para 400 e o cabeçalho `Content-Type` é definido para `text/plain; charset=utf-8`. Nota que se tentares definir o código da resposta depois disto, resultará em um aviso `[GIN-debug] [WARNING] Headers were already written. Wanted to override status code 400 with 422`. Se desejas ter maior controlo sobre o comportamento, considere usar o método equivalente `ShouldBind`.
- **Tipo** - Deveria vincular
	- **Métodos** - `ShouldBind`, `ShouldBindJSON`, `ShouldBindXML`, `ShouldBindQuery`, `ShouldBindYAML`
	- **Comportamento** - Estes métodos usam `ShouldBindWith` nos bastidores. Se houver um erro de vinculação, o erro é retornado e é responsabilidade do programador manipular a requisição e o erro apropriadamente.

Quando estiveres o método `Bind`, a Gin tenta inferir o vinculador dependendo do cabeçalho do `Content-Type`. Se estiveres certo daquilo que estiveres a vincular, podes usar `MustBindWith` ou `ShouldBindWith`.

Tu podes também especificar que os campos específicos são obrigatório. Se um campo for decorado com `binding:"required"` e tiver um valor vazio quando estiveres a vincular, um erro será retornado:

```go
// Vinculando a partir de JSON
type Login struct {
	User     string `form:"user" json:"user" xml:"user"  binding:"required"`
	Password string `form:"password" json:"password" xml:"password" binding:"required"`
}

func main() {
	router := gin.Default()

	// Exemplo para vincular o JSON ({"user": "manu", "password": "123"})
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

	// Exemplo pra vincular o XML (
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

	// Exemplo para vincular um formulário de HTML (user=manu&password=123)
	router.POST("/loginForm", func(c *gin.Context) {
		var form Login
		// Isto inferirá qual vinculador usar dependendo do cabeçalho do `content-type`.
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

	// Ouvir e servir na 0.0.0.0:8080
	router.Run(":8080")
}
```

### Requisição Simples

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

### Saltar a Validação

Quando estiveres a executar o exemplo de cima usando o comando `curl` de cima, isto retorna erro. Porque o exemplo usa `binding:"required"` para `Password`. Se usares `binding:"-"` para `Password`, então este não retornará erro quando estiveres a executar o exemplo de cima novamente.
