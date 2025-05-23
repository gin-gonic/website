---
title: "Configuración personalizada HTTP"
---

Se puede utilizar `http.ListenAndServe()` directamente, como se muestra:

```go
import "net/http"

func main() {
	router := gin.Default()
	http.ListenAndServe(":8080", router)
}
```
ó modificando valores de la siguiente manera:

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
