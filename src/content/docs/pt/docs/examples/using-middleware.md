---
title: "Usar Intermediário"
---

```go
func main() {
	// criar um roteador sem nenhum intermediário por padrão
	r := gin.New()

	// intermediário global
	// intermediário registador escreverá os registos ao "gin.DefaultWriter",
	// mesmo se definires com "GIN_MODE=release".
	// por padrão "gin.DefaultWriter = os.Stdout"
	router.Use(gin.Logger())

	// intermediário de recuperação recupera de quaisquer pânicos e
	// escreve um 500 se ouve um.
	router.Use(gin.Recovery())

	// intermediário por rota, podes adicionar tanto quanto desejares.
	router.GET("/benchmark", MyBenchLogger(), benchEndpoint)

	// grupo de autorização
	// authorized := router.Group("/", AuthRequired())
	// exatamente o mesmo que:
	authorized := router.Group("/")
	// intermediário por grupo! neste caso usamos o intermediário
	// "AuthRequired()" criado de maneira personalizada só no
	// grupo "authorized".
	authorized.Use(AuthRequired())
	{
		authorized.POST("/login", loginEndpoint)
		authorized.POST("/submit", submitEndpoint)
		authorized.POST("/read", readEndpoint)

		// grupo encaixado
		testing := authorized.Group("testing")
		testing.GET("/analytics", analyticsEndpoint)
	}

	// ouvir e servir no 0.0.0.0:8080
	router.Run(":8080")
}
```

