---
title: "Goroutines dentro de un middleware"

---

Cuando se inicia una goroutine dentro de un middleware o un handler, **NO SE DEBE** utilizar el context dentro de él, debe emplearse una copia de lectura.

```go
func main() {
	router := gin.Default()

	router.GET("/long_async", func(c *gin.Context) {
		// crear una copia para usar dentro de la rutina
		cCp := c.Copy()
		go func() {
			// se simula una tarea prolongada con un time.Sleep(). de 5 seconds
			time.Sleep(5 * time.Second)

			// IMPORTANTE: nótese que se trabaja con la copia del contexto "cCp"
			log.Println("Done! in path " + cCp.Request.URL.Path)
		}()
	})

	router.GET("/long_sync", func(c *gin.Context) {
		// se simula una tarea prolongada con un time.Sleep(). de 5 seconds
		time.Sleep(5 * time.Second)

		// debido a que NO se está usando una goroutine, no necesitamos una copia del context
		log.Println("Done! in path " + c.Request.URL.Path)
	})

	// Escucha y sirve peticiones en 0.0.0.0:8080
	router.Run(":8080")
}
```
