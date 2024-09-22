---
title: "SecureJSON"
draft: false
---

SecureJSON-i kasutamine json-kaaperdamise vältimiseks. Vaikimisi lisatakse vastuse kehasse `"while(1),"`, kui antud struktuur on massiivi väärtused.

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
