---
title: "XML/JSON/YAML/ProtoBuf 랜더링"
draft: false
---

```go
func main() {
	r := gin.Default()

	// gin.H은 map[string]interface{} 타입입니다.
	r.GET("/someJSON", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "hey", "status": http.StatusOK})
	})

	r.GET("/moreJSON", func(c *gin.Context) {
		// 구조체도 사용할 수 있습니다.
		var msg struct {
			Name    string `json:"user"`
			Message string
			Number  int
		}
		msg.Name = "Lena"
		msg.Message = "hey"
		msg.Number = 123
		// msg.Name은 JSON에서 "user"가 됩니다.
		// 출력내용  :   {"user": "Lena", "Message": "hey", "Number": 123}
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
		// protobuf의 정의는 testdata/protoexample 파일에 작성되어 있습니다.
		data := &protoexample.Test{
			Label: &label,
			Reps:  reps,
		}
		// 데이터는 응답(response)시에 이진 데이터가 됩니다.
		// protobuf로 직렬화된 protoexample.Test가 출력됩니다.
		c.ProtoBuf(http.StatusOK, data)
	})

	// 서버가 실행 되고 0.0.0.0:8080 에서 요청을 기다립니다.
	r.Run(":8080")
}
```
