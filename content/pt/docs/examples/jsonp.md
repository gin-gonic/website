---
title: "JSONP"
draft: false
---

Usando JSONP para pedir dados dum servidor num domínio diferente. Adicione a função de resposta ao corpo da resposta se a função de resposta do parâmetro da consulta existir:

```go
func main() {
	r := gin.Default()

	r.GET("/JSONP?callback=x", func(c *gin.Context) {
		data := map[string]interface{}{
			"foo": "bar",
		}
		
		// função de resposta é x
		// resultará em:   x({\"foo\":\"bar\"})
		c.JSONP(http.StatusOK, data)
	})

	// ouvir e servir no 0.0.0.0:8080
	r.Run(":8080")
}
```
