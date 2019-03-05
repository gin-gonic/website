---
title: "XML, JSON, YAML, ProtoBuf をレンダリングする"
draft: false
---

```go
func main() {
	r := gin.Default()

	// gin.H は map[string]interface{} へのショートカットです。
	r.GET("/someJSON", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "hey", "status": http.StatusOK})
	})

	r.GET("/moreJSON", func(c *gin.Context) {
		// 構造体を使うこともできます。
		var msg struct {
			Name    string `json:"user"`
			Message string
			Number  int
		}
		msg.Name = "Lena"
		msg.Message = "hey"
		msg.Number = 123
		// msg.Name は JSON 内で "user" となることに注意してください
		// 右記が出力されます  :   {"user": "Lena", "Message": "hey", "Number": 123}
		c.JSON(http.StatusOK, msg)
	})

	r.GET("/someXML", func(c *gin.Context) {
		c.XML(http.StatusOK, gin.H{"message": "hey", "status": http.StatusOK})
	})

	r.GET("/someYAML", func(c *gin.Context) {
		c.YAML(http.StatusOK, gin.H{"message": "hey", "status": http.StatusOK})
	})

	r.GET("/someProtoBuf", func(c *gin.Context) {
		reps := []int64{int64(1), int64(2)}
		label := "test"
		// protobuf の定義は testdata/protoexample にかかれています。
		data := &protoexample.Test{
			Label: &label,
			Reps:  reps,
		}
		// データはレスポンス時にバイナリデータになることに注意してください。
		// protoexample.Test の protobuf でシリアライズされたデータが出力されます。
		c.ProtoBuf(http.StatusOK, data)
	})

	// 0.0.0.0:8080 でサーバーを立てます。
	r.Run(":8080")
}
```


