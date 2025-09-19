---
title: "SecureJSON"
черновик: false
---

Использование SecureJSON для предотвращения перехвата json. По умолчанию добавляет `"while(1),"` в тело ответа, если заданная структура представляет собой массив значений.

```go
func main() {
  r := gin.Default()

  // You can also use your own secure json prefix
  // r.SecureJsonPrefix(")]}',\n")

  r.GET("/someJSON", func(c *gin.Context) {
    names := []string{"lena", "austin", "foo"}

    // Will output  :   while(1);["lena","austin","foo"]
    c.SecureJSON(http.StatusOK, names)
  })

  // Listen and serve on 0.0.0.0:8080
  r.Run(":8080")
}
```
