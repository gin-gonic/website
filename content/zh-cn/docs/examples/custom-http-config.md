---
title: "自定义 HTTP 配置"
draft: false
---

直接使用 `http.ListenAndServe()`，如下所示：

```go
func main() {
	router := gin.Default()
	http.ListenAndServe(":8080", router)
}
```
或

```go
func main() {
	router := gin.Default()

	s := &http.Server{
		Addr:           ":8080",
		Handler:        router,
		ReadTimeout:    10 * time.Second,
		WriteTimeout:   10 * time.Second,
		MaxHeaderBytes: 1 << 20,
	}
	s.ListenAndServe()
}
```
