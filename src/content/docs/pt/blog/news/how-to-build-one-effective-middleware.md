---
title: "Como Construir um Middleware Eficaz"
linkTitle: "Como Construir um Middleware Eficaz"
lastUpdated: 2019-02-26
---

## Partes constituintes

O middleware tipicamente consiste em duas partes:

- A primeira parte executa uma vez, quando você inicializa seu middleware. É aqui que você configura objetos globais, lógica de configuração, etc. -- tudo que precisa acontecer apenas uma vez durante o tempo de vida da aplicação.

- A segunda parte executa em cada requisição. Por exemplo, em um middleware de banco de dados, você injetaria seu objeto global de banco de dados no contexto da requisição. Uma vez no contexto, outros middlewares e suas funções handler podem recuperá-lo e usá-lo.

```go
func funcName(params string) gin.HandlerFunc {
  // <---
  // This is part one
  // --->
  // Example initialization: validate input params
  if err := check(params); err != nil {
      panic(err)
  }

  return func(c *gin.Context) {
    // <---
    // This is part two
    // --->
    // Example execution per request: inject into context
    c.Set("TestVar", params)
    c.Next()
  }
}
```

## Processo de execução

Vamos analisar o seguinte código de exemplo:

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

De acordo com a seção [Partes constituintes](#partes-constituintes) acima, quando você executa o processo do Gin, a **parte um** de cada middleware executa primeiro e imprime as seguintes informações:

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

Quando você faz uma requisição -- por exemplo, `curl -v localhost:8080/rest/n/api/some` -- a **parte dois** de cada middleware executa em ordem e produz a seguinte saída:

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
