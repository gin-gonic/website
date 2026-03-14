---
title: "Özel HTTP yapılandırması"
sidebar:
  order: 1
---

`http.ListenAndServe()` fonksiyonunu doğrudan şu şekilde kullanın:

```go
import "net/http"

func main() {
  router := gin.Default()
  http.ListenAndServe(":8080", router)
}
```
veya

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
