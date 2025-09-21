---
title: "Como Construir um Middleware Eficaz"
linkTitle: "Como Construir um Middleware Eficaz"
lastUpdated: 2019-02-26
---

## Partes Constituintes

O middleware geralmente consiste em duas partes:

- A primeira parte executa apenas uma vez, quando inicializa seu middleware. É nesse ponto que você configura objetos globais, lógica de configuração, etc.—tudo que só precisa acontecer uma única vez durante o ciclo de vida da aplicação.

- A segunda parte executa a cada requisição. Por exemplo, em um middleware de banco de dados, você injeta seu objeto de banco de dados global no contexto da requisição. Uma vez inserido no contexto, outros middlewares e suas funções manipuladoras podem recuperá-lo e usá-lo.

```go
func funcName(params string) gin.HandlerFunc {
  // <---
  // Esta é a primeira parte
  // --->
  // Exemplo de inicialização: validar parâmetros de entrada
  if err := check(params); err != nil {
      panic(err)
  }

  return func(c *gin.Context) {
    // <---
    // Esta é a segunda parte
    // --->
    // Execução por requisição: injeta no contexto
    c.Set("TestVar", params)
    c.Next()
  }
}
```

## Processo de Execução

Vamos analisar o seguinte exemplo de código:

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

De acordo com a seção [Partes Constituintes](#partes-constituinte), ao executar o processo Gin, **a primeira parte** de cada middleware é executada antes, imprimindo as seguintes informações:

```go
globalMiddleware...1
mid1...1
mid2...1
```

A ordem de inicialização é:

```go
globalMiddleware...1
    |
    v
mid1...1
    |
    v
mid2...1
```

Quando você faz uma requisição—por exemplo, `curl -v localhost:8080/rest/n/api/some`—**a segunda parte** de cada middleware é executada em ordem e imprime o seguinte:

```go
globalMiddleware...2
mid1...2
mid2...2
exec handler.
mid2...3
mid1...3
globalMiddleware...3
```

Ou seja, a ordem de execução é:

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
