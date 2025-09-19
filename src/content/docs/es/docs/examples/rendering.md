---
title: "Procesamiento de XML/JSON/YAML/ProtoBuf"
---

```go
func main() {
  router := gin.Default()

  // gin.H es un método abreviado para map[string]interface{}
  router.GET("/someJSON", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{"message": "hey", "status": http.StatusOK})
  })

  router.GET("/moreJSON", func(c *gin.Context) {
    // También puedes usar un struct
    var msg struct {
      Name    string `json:"user"`
      Message string
      Number  int
    }
    msg.Name = "Lena"
    msg.Message = "hey"
    msg.Number = 123
    // Nótese que msg.Name se convierte en "user" dentro del JSON
    // Arrojará  :   {"user": "Lena", "Message": "hey", "Number": 123}
    c.JSON(http.StatusOK, msg)
  })

  router.GET("/someXML", func(c *gin.Context) {
    c.XML(http.StatusOK, gin.H{"message": "hey", "status": http.StatusOK})
  })

  router.GET("/someYAML", func(c *gin.Context) {
    c.YAML(http.StatusOK, gin.H{"message": "hey", "status": http.StatusOK})
  })

  router.GET("/someProtoBuf", func(c *gin.Context) {
    reps := []int64{int64(1), int64(2)}
    label := "test"
    // La definición del protobuf se encuentra escrita en el archivo testdata/protoexample.
    data := &protoexample.Test{
      Label: &label,
      Reps:  reps,
    }
    // Nota: en la respuesta los datos se vuelven binarios
    // Arrojará la data serializada de protoexample.Test
    c.ProtoBuf(http.StatusOK, data)
  })

  router.Run(":8080")
}
```
