---
title: "JSONP"
черновик: false
---

Использование JSONP для запроса данных с сервера в другом домене. Добавьте обратный вызов в тело ответа, если существует обратный вызов параметра запроса.

```go
func main() {
  r := gin.Default()

  r.GET("/JSONP?callback=x", func(c *gin.Context) {
    data := map[string]interface{}{
      "foo": "bar",
    }
    
    //callback is x
    // Will output  :   x({\"foo\":\"bar\"})
    c.JSONP(http.StatusOK, data)
  })

  // Listen and serve on 0.0.0.0:8080
  r.Run(":8080")
}
```
