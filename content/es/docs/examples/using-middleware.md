---
title: "Usando middleware"
draft: false
---

```go
func main() {
	// Se crea el router por defecto sin ningún middleware
	r := gin.New()

	// Middleware global
	// El middlware Logger escribirá los logs hacia gin.DefaultWriter incluso si se configura GIN_MODE=release.
	// Por defecto será gin.DefaultWriter = os.Stdout
	router.Use(gin.Logger())

	// El middleware Recovery recupera al servicio de cualquier panics y registra un error 500 si existiese uno.
	router.Use(gin.Recovery())

	// Middleware por ruta, se pueden añadir tantos como sea necesario.
	router.GET("/benchmark", MyBenchLogger(), benchEndpoint)

	// Grupo de Authorization
	// authorized := router.Group("/", AuthRequired())
	// exactamente el mismo que:
	authorized := router.Group("/")
	// Middleware por grupo. En este caso usamos el grupo creado
	// y se aplicará AuthRequired() middleware únicamente en el grupo "authorized".
	authorized.Use(AuthRequired())
	{
		authorized.POST("/login", loginEndpoint)
		authorized.POST("/submit", submitEndpoint)
		authorized.POST("/read", readEndpoint)

		// Grupo anidado
		testing := authorized.Group("testing")
		testing.GET("/analytics", analyticsEndpoint)
	}

	router.Run(":8080")
}
```

