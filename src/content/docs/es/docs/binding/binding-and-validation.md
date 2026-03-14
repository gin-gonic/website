---
title: "Enlace y validación de modelos"
sidebar:
  order: 1
---

Para enlazar el cuerpo de una solicitud a un tipo, usa el enlace de modelos. Actualmente soportamos el enlace de JSON, XML, YAML y valores de formulario estándar (foo=bar&boo=baz).

Gin usa [**go-playground/validator/v10**](https://github.com/go-playground/validator) para la validación. Consulta la documentación completa sobre el uso de etiquetas [aquí](https://pkg.go.dev/github.com/go-playground/validator/v10#hdr-Baked_In_Validators_and_Tags).

Ten en cuenta que necesitas establecer la etiqueta de enlace correspondiente en todos los campos que deseas enlazar. Por ejemplo, al enlazar desde JSON, establece `json:"fieldname"`.

Además, Gin proporciona dos conjuntos de métodos para el enlace:
- **Tipo** - Enlace obligatorio
  - **Métodos** - `Bind`, `BindJSON`, `BindXML`, `BindQuery`, `BindYAML`
  - **Comportamiento** - Estos métodos usan `MustBindWith` internamente. Si hay un error de enlace, la solicitud se aborta con `c.AbortWithError(400, err).SetType(ErrorTypeBind)`. Esto establece el código de estado de respuesta a 400 y el encabezado `Content-Type` se establece a `text/plain; charset=utf-8`. Ten en cuenta que si intentas establecer el código de respuesta después de esto, resultará en una advertencia `[GIN-debug] [WARNING] Headers were already written. Wanted to override status code 400 with 422`. Si deseas tener mayor control sobre el comportamiento, considera usar el método equivalente `ShouldBind`.
- **Tipo** - Enlace condicional
  - **Métodos** - `ShouldBind`, `ShouldBindJSON`, `ShouldBindXML`, `ShouldBindQuery`, `ShouldBindYAML`
  - **Comportamiento** - Estos métodos usan `ShouldBindWith` internamente. Si hay un error de enlace, el error se devuelve y es responsabilidad del desarrollador manejar la solicitud y el error apropiadamente.

Al usar el método Bind, Gin intenta inferir el binder dependiendo del encabezado Content-Type. Si estás seguro de lo que estás enlazando, puedes usar `MustBindWith` o `ShouldBindWith`.

También puedes especificar que campos específicos son requeridos. Si un campo está decorado con `binding:"required"` y tiene un valor vacío al momento del enlace, se devolverá un error.

Si uno de los campos del struct es a su vez un struct (struct anidado), los campos de ese struct también necesitarán estar decorados con `binding:"required"` para validar correctamente.

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

### Solicitud de ejemplo

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

### Omitir validación

Al ejecutar el ejemplo anterior usando el comando `curl` de arriba, devuelve un error. Porque el ejemplo usa `binding:"required"` para `Password`. Si usas `binding:"-"` para `Password`, entonces no devolverá error al ejecutar el ejemplo de nuevo.

## Ver también

- [Validadores personalizados](/es/docs/binding/custom-validators/)
- [Enlazar cadena de consulta o datos post](/es/docs/binding/bind-query-or-post/)
