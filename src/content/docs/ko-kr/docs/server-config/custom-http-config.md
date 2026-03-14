---
title: "커스텀 HTTP 설정"
sidebar:
  order: 1
---

다음과 같이 `http.ListenAndServe()`를 직접 사용합니다:

```go
import "net/http"

func main() {
  router := gin.Default()
  http.ListenAndServe(":8080", router)
}
```
또는

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
