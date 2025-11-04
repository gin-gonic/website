---
title: "Render XML/JSON/YAML/ProtoBuf"
---

```go
func main() {
  router := gin.Default()

  // gin.H adalah pintasan untuk map[string]interface{}
  router.GET("/someJSON", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{"message": "hey", "status": http.StatusOK})
  })

  router.GET("/moreJSON", func(c *gin.Context) {
    // Anda juga dapat menggunakan struct
    var msg struct {
      Name    string `json:"user"`
      Message string
      Number  int
    }
    msg.Name = "Lena"
    msg.Message = "hey"
    msg.Number = 123
    // Perhatikan bahwa msg.Name menjadi "user" di JSON
    // Akan menghasilkan  :   {"user": "Lena", "Message": "hey", "Number": 123}
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
    // Definisi spesifik dari protobuf ditulis di file testdata/protoexample.
    data := &protoexample.Test{
      Label: &label,
      Reps:  reps,
    }
    // Perhatikan bahwa data menjadi data biner dalam respons
    // Akan menghasilkan data serialisasi protobuf protoexample.Test
    c.ProtoBuf(http.StatusOK, data)
  })

  // jalankan server pada 0.0.0.0:8080
  router.Run(":8080")
}
```
