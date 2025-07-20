---
title: "提供靜態檔案"
---

```go
func main() {
	router := gin.Default()
	router.Static("/assets", "./assets")
	router.StaticFS("/more_static", http.Dir("my_file_system"))
	router.StaticFile("/favicon.ico", "./resources/favicon.ico")

	// 在 0.0.0.0:8080 上監聽並提供服務
	router.Run(":8080")
}
```
