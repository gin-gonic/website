---
title: "カスタム HTTP 設定"
---

以下のように `http.ListenAndServe()` を直接使ってください。

```go
import "net/http"

func main() {
	router := gin.Default()
	http.ListenAndServe(":8080", router)
}
```
あるいは

```go
import "net/http"

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


