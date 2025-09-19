---
title: "Interpretação de XML/JSON/YAML/ProtoBuf"
---

```go
func main() {
  router := gin.Default()

  // "gin.H" é um atalho para "map[string]interface{}"
  router.GET("/someJSON", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{"message": "hey", "status": http.StatusOK})
  })

  router.GET("/moreJSON", func(c *gin.Context) {
    // também podes usar uma estrutura
    var msg struct {
      Name    string `json:"user"`
      Message string
      Number  int
    }
    msg.Name = "Lena"
    msg.Message = "hey"
    msg.Number = 123
    // nota que "msg.Name" torna-se "user" na JSON
    // resultará em: {"user": "Lena", "Message": "hey", "Number": 123}
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
    // a definição específica do protobuf
    // está escrita no ficheiro "testdata/protoexample"
    data := &protoexample.Test{
      Label: &label,
      Reps:  reps,
    }
    // nota que os dados tornam-se dados binários na resposta
    // resultará em dados serializados de "protobuf" de "protoexample.Test"
    c.ProtoBuf(http.StatusOK, data)
  })

  // ouvir e servir na 0.0.0.0:8080
  router.Run(":8080")
}
```
