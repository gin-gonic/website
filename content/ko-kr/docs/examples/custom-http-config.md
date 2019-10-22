---
title: "HTTP 구성 사용자 정의"
draft: false
---

아래와 같이 직접 `http.ListenAndServe()` 를 사용하세요:

```go
func main() {
	router := gin.Default()
	http.ListenAndServe(":8080", router)
}
```
혹은

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
