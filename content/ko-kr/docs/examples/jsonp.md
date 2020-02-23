---
title: "JSONP"
draft: false
---

JSONP를 사용하여 다른 도메인의 서버에 요청하고 데이터를 받아올 수 있습니다. 조회 매개변수 콜백이 존재하는 경우 응답 본문에 콜백을 추가하세요.

```go
func main() {
	r := gin.Default()

	r.GET("/JSONP?callback=x", func(c *gin.Context) {
		data := map[string]interface{}{
			"foo": "bar",
		}

		//callback은 x입니다
		// 출력내용  :   x({\"foo\":\"bar\"})
		c.JSONP(http.StatusOK, data)
	})

	// 서버가 실행 되고 0.0.0.0:8080 에서 요청을 기다립니다.
	r.Run(":8080")
}
```
