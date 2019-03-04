---
title: "静的ファイルを返す"
draft: false
---

```go
func main() {
	router := gin.Default()
	router.Static("/assets", "./assets")
	router.StaticFS("/more_static", http.Dir("my_file_system"))
	router.StaticFile("/favicon.ico", "./resources/favicon.ico")

	// 0.0.0.0:8080 でサーバーを立てます。
	router.Run(":8080")
}
```
