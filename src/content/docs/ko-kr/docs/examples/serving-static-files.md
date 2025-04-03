---
title: "정적 파일 반환"
draft: false
---

```go
func main() {
	router := gin.Default()
	router.Static("/assets", "./assets")
	router.StaticFS("/more_static", http.Dir("my_file_system"))
	router.StaticFile("/favicon.ico", "./resources/favicon.ico")

	// 서버가 실행 되고 0.0.0.0:8080 에서 요청을 기다립니다.
	router.Run(":8080")
}
```
