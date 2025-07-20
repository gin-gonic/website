---
title: "XML/JSON/YAML/ProtoBuf 渲染"
---

```go
func main() {
	router := gin.Default()

	// gin.H 是 map[string]interface{} 的簡寫
	router.GET("/someJSON", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "嘿", "status": http.StatusOK})
	})

	router.GET("/moreJSON", func(c *gin.Context) {
		// 您也可以使用結構
		var msg struct {
			Name    string `json:"user"`
			Message string
			Number  int
		}
		msg.Name = "Lena"
		msg.Message = "嘿"
		msg.Number = 123
		// 請注意，msg.Name 在 JSON 中會變成 "user"
		// 將輸出：   {"user": "Lena", "Message": "hey", "Number": 123}
		c.JSON(http.StatusOK, msg)
	})

	router.GET("/someXML", func(c *gin.Context) {
		c.XML(http.StatusOK, gin.H{"message": "嘿", "status": http.StatusOK})
	})

	router.GET("/someYAML", func(c *gin.Context) {
		c.YAML(http.StatusOK, gin.H{"message": "嘿", "status": http.StatusOK})
	})

	router.GET("/someProtoBuf", func(c *gin.Context) {
		reps := []int64{int64(1), int64(2)}
		label := "test"
		// protobuf 的具體定義寫在 testdata/protoexample 檔案中。
		data := &protoexample.Test{
			Label: &label,
			Reps:  reps,
		}
		// 請注意，資料在回應中會變成二進位資料
		// 將輸出 protoexample.Test protobuf 序列化資料
		c.ProtoBuf(http.StatusOK, data)
	})

	// 在 0.0.0.0:8080 上監聽並提供服務
	router.Run(":8080")
}
```
