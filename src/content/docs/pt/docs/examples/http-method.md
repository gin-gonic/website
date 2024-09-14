---
title: "Usando o Método de HTTP"

---

```go
func main() {
	// criar um roteador de gin com intermediário padrão:
	// intermediário registador e de recuperação (livre de avaria)
	router := gin.Default()

	router.GET("/someGet", getting)
	router.POST("/somePost", posting)
	router.PUT("/somePut", putting)
	router.DELETE("/someDelete", deleting)
	router.PATCH("/somePatch", patching)
	router.HEAD("/someHead", head)
	router.OPTIONS("/someOptions", options)

	// por padrão serve na :8080 a menos que uma
	// variável de ambiente PORT fosse definida.
	router.Run()
	// router.Run(":3000") para uma porta definida manualmente
}
```
