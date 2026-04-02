---
title: "Enlace de datos"
sidebar:
  order: 4
---

Gin proporciona un potente sistema de enlace de datos que analiza los datos de la solicitud en structs de Go y los valida automáticamente. En lugar de llamar manualmente a `c.PostForm()` o leer `c.Request.Body`, defines un struct con etiquetas y dejas que Gin haga el trabajo.

## Bind vs ShouldBind

Gin ofrece dos familias de métodos de enlace:

| Método | En caso de error | Usar cuando |
|--------|----------|----------|
| `c.Bind`, `c.BindJSON`, etc. | Llama a `c.AbortWithError(400, err)` automáticamente | Quieres que Gin maneje las respuestas de error |
| `c.ShouldBind`, `c.ShouldBindJSON`, etc. | Devuelve el error para que tú lo manejes | Quieres respuestas de error personalizadas |

En la mayoría de los casos, **prefiere `ShouldBind`** para mayor control sobre el manejo de errores.

## Ejemplo rápido

```go
type LoginForm struct {
  User     string `form:"user" binding:"required"`
  Password string `form:"password" binding:"required"`
}

func main() {
  router := gin.Default()

  router.POST("/login", func(c *gin.Context) {
    var form LoginForm
    // ShouldBind checks Content-Type to select a binding engine automatically
    if err := c.ShouldBind(&form); err != nil {
      c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      return
    }
    c.JSON(http.StatusOK, gin.H{"status": "logged in"})
  })

  router.Run(":8080")
}
```

## Formatos soportados

Gin puede enlazar datos de muchas fuentes: **JSON**, **XML**, **YAML**, **TOML**, **datos de formulario** (codificado en URL y multipart), **cadenas de consulta**, **parámetros de URI** y **encabezados**. Usa la etiqueta de struct apropiada (`json`, `xml`, `yaml`, `form`, `uri`, `header`) para mapear campos. Las reglas de validación van en la etiqueta `binding` y usan la sintaxis de [go-playground/validator](https://github.com/go-playground/validator).

## En esta sección

- [**Enlace y validación de modelos**](./binding-and-validation/) -- Conceptos básicos de enlace y reglas de validación
- [**Validadores personalizados**](./custom-validators/) -- Registrar tus propias funciones de validación
- [**Enlazar cadena de consulta o datos post**](./bind-query-or-post/) -- Enlazar desde cadenas de consulta y cuerpos de formularios
- [**Enlazar URI**](./bind-uri/) -- Enlazar parámetros de ruta en structs
- [**Enlazar encabezados**](./bind-header/) -- Enlazar encabezados HTTP en structs
- [**Valores predeterminados**](./default-value/) -- Establecer valores de respaldo para campos faltantes
- [**Formato de colección**](./collection-format/) -- Manejar parámetros de consulta tipo array
- [**Unmarshaler personalizado**](./custom-unmarshaler/) -- Implementar lógica de deserialización personalizada
- [**Enlazar checkboxes HTML**](./bind-html-checkboxes/) -- Manejar entradas de formulario tipo checkbox
- [**Enlace multipart/urlencoded**](./multipart-urlencoded-binding/) -- Enlazar datos de formulario multipart
- [**Etiqueta de struct personalizada**](./custom-struct-tag/) -- Usar etiquetas de struct personalizadas para el mapeo de campos
- [**Intentar enlazar el cuerpo en diferentes structs**](./bind-body-into-different-structs/) -- Analizar el cuerpo de la solicitud más de una vez
