---
title: "Uso de un método específico de HTTP"
draft: false
---

```go
func main() {
    // Crea un route de gin con middleware por defecto:
    // logger y recovery (crash-free) middleware
	router := gin.Default()

	router.GET("/someGet", getting)
	router.POST("/somePost", posting)
	router.PUT("/somePut", putting)
	router.DELETE("/someDelete", deleting)
	router.PATCH("/somePatch", patching)
	router.HEAD("/someHead", head)
	router.OPTIONS("/someOptions", options)

	// Sirve por defecto en el puerto 8080
	// Salvo que una Variable de entorno PORT haya sido definida
	router.Run()
	// router.Run(":3000") para definir por código el puerto 3000
}
```
