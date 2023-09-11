---
title: "Rotinas de Go dentro dum Intermediário"
draft: false
---

Quando começares novas rotinas de Go dentro dum intermediário ou manipulador, **NÃO DEVERIAS** usar o contexto original dentro dele, tens que usar uma cópia de apenas leitura.

```go
func main() {
	r := gin.Default()

	r.GET("/long_async", func(c *gin.Context) {
		// criar cópia a ser usada dentro da rotina de go
		cCp := c.Copy()
		go func() {
			// simular uma tarefa longa com time.Sleep(). 5 segundos
			time.Sleep(5 * time.Second)

			// nota que estás a usar o contexto copiado "cCp", IMPORTANTE
			log.Println("Done! in path " + cCp.Request.URL.Path)
		}()
	})

	r.GET("/long_sync", func(c *gin.Context) {
		// simular uma tarefa longa com time.Sleep(). 5 segundos
		time.Sleep(5 * time.Second)

		// já que não estamos a usar uma rotina de Go, não temos que copiar o contexto
		log.Println("Done! in path " + c.Request.URL.Path)
	})

	// ouvir e servir na porta 0.0.0.0:8080
	r.Run(":8080")
}
```
