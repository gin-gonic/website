---
title: "SecureJSON"
draft: false
---

json 하이재킹을 방지하기 위해 SecureJSON를 사용합니다.
주어진 구조체가 배열인 경우, 기본적으로 `"while(1),"` 이 응답 본문에 포함 됩니다.

```go
func main() {
	r := gin.Default()

	// 자체적인 보인 json 접두사를 사용할 수도 있습니다.
	// r.SecureJsonPrefix(")]}',\n")

	r.GET("/someJSON", func(c *gin.Context) {
		names := []string{"lena", "austin", "foo"}

		// 출력내용  :   while(1);["lena","austin","foo"]
		c.SecureJSON(http.StatusOK, names)
	})

	// 서버가 실행 되고 0.0.0.0:8080 에서 요청을 기다립니다.
	r.Run(":8080")
}
```
