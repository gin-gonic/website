---
title: "Como construir um intermediário efetivo?"
linkTitle: "Como construir um intermediário efetivo?"
date: 2019-02-26
---

## Partes constituintes

O intermediário tem duas partes:

  - A parte um é a que é executada uma vez, quando inicializares o teu intermediário. É onde defines todos os objetos globais, lógicas etc. Tudo que acontece uma vez por vida de aplicação.

  - A parte dois é a que executa sobre toda requisição. Por exemplo, um intermediário de base de dados que simplesmente injetas o teu objeto de base de dados "global" no contexto. Uma vez dentro do contexto, podes recuperá-lo dentro de outros intermediários e tua função manipuladora:

```go
func funcName(params string) gin.HandlerFunc {
    // <---
    // Isto é a parte um
    // --->
    // O seguinte código é um exemplo
    if err := check(params); err != nil {
        panic(err)
    }

    return func(c *gin.Context) {
        // <---
        // Isto é a parte dois
        // --->
        // O seguinte código é um exemplo
        c.Set("TestVar", params)
        c.Next()    
    }
}
```

## Processo de execução

Primeiramente, temos o seguinte código de exemplo:

```go
func main() {
	router := gin.Default()

	router.Use(globalMiddleware())

	router.GET("/rest/n/api/*some", mid1(), mid2(), handler)

	router.Run()
}

func globalMiddleware() gin.HandlerFunc {
	fmt.Println("globalMiddleware...1")

	return func(c *gin.Context) {
		fmt.Println("globalMiddleware...2")
		c.Next()
		fmt.Println("globalMiddleware...3")
	}
}

func handler(c *gin.Context) {
	fmt.Println("exec handler.")
}

func mid1() gin.HandlerFunc {
	fmt.Println("mid1...1")

	return func(c *gin.Context) {

		fmt.Println("mid1...2")
		c.Next()
		fmt.Println("mid1...3")
	}
}

func mid2() gin.HandlerFunc {
	fmt.Println("mid2...1")

	return func(c *gin.Context) {
		fmt.Println("mid2...2")
		c.Next()
		fmt.Println("mid2...3")
	}
}
```

De acordo com as [partes constituintes](#partes-constituintes) disseram, quando executamos o processo de `gin`, a **parte um** executará em primeiro lugar e imprimirá a seguinte informação:

```go
globalMiddleware...1
mid1...1
mid2...1
```

E a ordem de inicialização é:

```go
globalMiddleware...1
    |
    v
mid1...1
    |
    v
mid2...1
```

Quando ondulamos uma requisição com `curl -v localhost:8080/rest/n/api/some`, a **parte dois** executará os seus intermediários e retornará como saída a seguinte informação:

```go
globalMiddleware...2
mid1...2
mid2...2
exec handler.
mid2...3
mid1...3
globalMiddleware...3
```

Em outras palavras, a ordem de execução é:

```go
globalMiddleware...2
    |
    v
mid1...2
    |
    v
mid2...2
    |
    v
exec handler.
    |
    v
mid2...3
    |
    v
mid1...3
    |
    v
globalMiddleware...3
```


