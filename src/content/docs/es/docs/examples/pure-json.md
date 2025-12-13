---
title: "PureJSON"
---
Usualmente, JSON sustituye carácteres especiales HTML con sus entidades unicode. Por ejemplo `<` se convierte a `\u003c`. Si se requiere condificar este tipo de caracteres literalmente, se puede utilizar PureJSON.
Esta característica no está disponible en Go 1.6 o versiones inferiores.

```go
func main() {
  router := gin.Default()
  
  // Sirve entidades unicode
  router.GET("/json", func(c *gin.Context) {
    c.JSON(200, gin.H{
      "html": "<b>Hello, world!</b>",
    })
  })
  
  // Sirve carácteres literales
  router.GET("/purejson", func(c *gin.Context) {
    c.PureJSON(200, gin.H{
      "html": "<b>Hello, world!</b>",
    })
  })

  // Abortar temprano con una respuesta PureJSON y código de estado (v1.11+)
  router.GET("/abort_purejson", func(c *gin.Context) {
    c.AbortWithStatusPureJSON(403, gin.H{"error": "forbidden"})
  })

  // Escucha y sirve peticiones en 0.0.0.0:8080
  router.Run(":8080")
}
```
