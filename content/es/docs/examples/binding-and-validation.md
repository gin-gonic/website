---
title: "Vincular y validar un Modelo"
draft: false
---

Para vincular el cuerpo de un request en un tipo, puede hacerse el vínculo a un modelo. Actualmente se soporta el vínculo a JSON, XML, YAML y valores estandar para formularios (foo=bar&boo=baz).

Gin emplea para realizar validación el paquete [**go-playground/validator.v8**](https://github.com/go-playground/validator). Puedes revisar la documentación completa de validación por medio de tags [aquí](http://godoc.org/gopkg.in/go-playground/validator.v8#hdr-Baked_In_Validators_and_Tags).

Es necesario establecer el tag correspondiente en todos los campos que se desea vincular. Por ejemplo, cuando se vinculan datos de JSON debe definirse el tag `json:"fieldname"`.

Adicionalmente, Gin dispone de dos conjunto de métodos para vincular:
- **Tipo** - Must bind (Vínculo obligatorio)
  - **Métodos** - `Bind`, `BindJSON`, `BindXML`, `BindQuery`, `BindYAML`
  - **Comportamiento** - Estos métodos emplean internamente `MustBindWith`. Si ocurre un error al vincularse, la petición se aborta con `c.AbortWithError(400, err).SetType(ErrorTypeBind)`. Esto configura el estatus de la respuesta 400 y el header `Content-Type` se establece en `text/plain; charset=utf-8`. Nótese que si se intenta establecer otro tipo de códgio de respuesta posteriormente, provocará la generación de una advertencia `[GIN-debug] [WARNING] Headers were already written. Wanted to override status code 400 with 422`. Para un control más personalizado de este comportamiento, puede emplearse el método equivalente `ShouldBind`.
- **Tipo** - Should bind (Vínculo no obligatorio)
  - **Métodos** - `ShouldBind`, `ShouldBindJSON`, `ShouldBindXML`, `ShouldBindQuery`, `ShouldBindYAML`
  - **Comportamiento** - Estos métodos implementan `ShouldBindWith` internamente. Si ocurre un error al vincularse, el error es retornado y queda a juicio del desarrollador la forma apropiada de manejar la petición y el error ocurrido.

Cuando se usa el método de vínculo, Gin tratará de inferir dependiendo del valor del header Content-Type. Si se cuenta con total certeza del tipo de dato a vincular ,puede usarse `MustBindWith` ó `ShouldBindWith`.

También pueden declararse los campos como requeridos. Si un campo tiene declarado el tag `binding:"required"` y el valor viene vacío devolverá un error al tratar de vincularse.

```go
// Vincular empleando JSON
type Login struct {
	User     string `form:"user" json:"user" xml:"user"  binding:"required"`
	Password string `form:"password" json:"password" xml:"password" binding:"required"`
}

func main() {
	router := gin.Default()

	// Ejemplo para vincular JSON ({"user": "manu", "password": "123"})
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

	// Vincular empleando XML (
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

	// Ejemplo para vincular un formulario HTML (user=manu&password=123)
	router.POST("/loginForm", func(c *gin.Context) {
		var form Login
		// De esta forma se intenta vincular tratando a partir del valor del header content-type.
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

	// Escucha y sirve peticiones en 0.0.0.0:8080
	router.Run(":8080")
}
```

### Petición de ejemplo

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

### Evitar la validación

Al ejecutar el el ejemplo de arriba con el comando `curl` devuelve error a causa del tag `binding:"required"` para el campo `Password`. El error deja de aparecer si se remplaza por el tag `binding:"-"`.
