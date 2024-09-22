---
title: "PureJSON"
draft: false
---

Tavaliselt, JSON asendab erilisi HTML märke koos nende unicode-olemitega, näiteks `<` saab `\u003c`. Kui soovite selliseid märke sõna-sõnalt kodeerida, kasutage selle asemel PureJSON-i.
See funktsioon pole saadaval Go 1.6 ja madalamal.

```go
func main() {
	r := gin.Default()
	
	// Serves unicode entities
	r.GET("/json", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"html": "<b>Hello, world!</b>",
		})
	})
	
	// Serves literal characters
	r.GET("/purejson", func(c *gin.Context) {
		c.PureJSON(200, gin.H{
			"html": "<b>Hello, world!</b>",
		})
	})
	
	// listen and serve on 0.0.0.0:8080
	r.Run(":8080")
}
```
