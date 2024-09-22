---
title: "JSONP"
draft: false
---

JSONP kasutamine teises domeenis asuvalt serverilt andmete küsimiseks. Kui päringuparameetri tagasihelistamine on olemas, lisage vastuse kehasse tagasihelistamine.

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
