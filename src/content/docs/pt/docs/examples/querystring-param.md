---
title: "Parâmetros da Sequência de Consulta"
---

```go
func main() {
  router := gin.Default()

  // os parâmetros da sequência de caracteres de consulta 
  // são analisados usando objeto de requisição subjacente existente.
  // a requisição responde à uma URL correspondendo a:
  // /welcome?firstname=Jane&lastname=Doe
  router.GET("/welcome", func(c *gin.Context) {
    firstname := c.DefaultQuery("firstname", "Guest")
    lastname := c.Query("lastname") // atalho para c.Request.URL.Query().Get("lastname")

    c.String(http.StatusOK, "Hello %s %s", firstname, lastname)
  })
  router.Run(":8080")
}
```
