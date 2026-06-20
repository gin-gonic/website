---
title: "Documentação"
sidebar:
  order: 20
---

Gin é um framework web HTTP de alto desempenho escrito em [Go](https://go.dev/). Ele fornece uma API semelhante ao Martini, mas com desempenho significativamente melhor — até 40 vezes mais rápido — graças ao [httprouter](https://github.com/julienschmidt/httprouter). O Gin foi projetado para construir APIs REST, aplicações web e microsserviços onde velocidade e produtividade do desenvolvedor são essenciais.

**Por que escolher o Gin?**

O Gin combina a simplicidade do roteamento no estilo Express.js com as características de desempenho do Go, tornando-o ideal para:

- Construir APIs REST de alta vazão
- Desenvolver microsserviços que precisam lidar com muitas requisições simultâneas
- Criar aplicações web que exigem tempos de resposta rápidos
- Prototipar serviços web rapidamente com o mínimo de código repetitivo

**Principais recursos do Gin:**

- **Roteador sem alocação** - Roteamento extremamente eficiente em memória, sem alocações no heap
- **Alto desempenho** - Benchmarks mostram velocidade superior em comparação com outros frameworks web em Go
- **Suporte a middleware** - Sistema extensível de middleware para autenticação, logging, CORS, etc.
- **À prova de falhas** - Middleware de recuperação integrado que evita que panics derrubem seu servidor
- **Validação de JSON** - Binding e validação automática de JSON em requisições/respostas
- **Agrupamento de rotas** - Organize rotas relacionadas e aplique middleware comum
- **Gerenciamento de erros** - Tratamento e logging centralizado de erros
- **Renderização integrada** - Suporte para JSON, XML, templates HTML e mais
- **Extensível** - Grande ecossistema de middleware e plugins da comunidade

## Primeiros Passos

### Pré-requisitos

- **Versão do Go**: O Gin requer [Go](https://go.dev/) versão [1.25](https://go.dev/doc/devel/release#go1.25) ou superior
- **Conhecimento básico de Go**: Familiaridade com a sintaxe do Go e gerenciamento de pacotes é útil

### Instalação

Com o [suporte a módulos do Go](https://go.dev/wiki/Modules#how-to-use-modules), basta importar o Gin no seu código e o Go irá buscá-lo automaticamente durante o build:

```go
import "github.com/gin-gonic/gin"
```

### Sua Primeira Aplicação Gin

Aqui está um exemplo completo que demonstra a simplicidade do Gin:

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  // Create a Gin router with default middleware (logger and recovery)
  r := gin.Default()

  // Define a simple GET endpoint
  r.GET("/ping", func(c *gin.Context) {
    // Return JSON response
    c.JSON(http.StatusOK, gin.H{
      "message": "pong",
    })
  })

  // Start server on port 8080 (default)
  // Server will listen on 0.0.0.0:8080 (localhost:8080 on Windows)
  r.Run()
}
```

**Executando a aplicação:**

1. Salve o código acima como `main.go`
2. Execute a aplicação:

   ```sh
   go run main.go
   ```

3. Abra seu navegador e acesse [`http://localhost:8080/ping`](http://localhost:8080/ping)
4. Você deverá ver: `{"message":"pong"}`

**O que este exemplo demonstra:**

- Criação de um roteador Gin com middleware padrão
- Definição de endpoints HTTP com funções handler simples
- Retorno de respostas JSON
- Inicialização de um servidor HTTP

### Próximos Passos

Após executar sua primeira aplicação Gin, explore estes recursos para aprender mais:

#### Recursos de Aprendizado

- **[Guia de Início Rápido do Gin](./quickstart/)** - Tutorial completo com exemplos de API e configurações de build
- **[Repositório de Exemplos](https://github.com/gin-gonic/examples)** - Exemplos prontos para execução demonstrando diversos casos de uso do Gin:
  - Desenvolvimento de API REST
  - Autenticação e middleware
  - Upload e download de arquivos
  - Conexões WebSocket
  - Renderização de templates

### Tutoriais Oficiais

- [Tutorial Go.dev: Desenvolvendo uma API RESTful com Go e Gin](https://go.dev/doc/tutorial/web-service-gin)

## Ecossistema de Middleware

O Gin possui um rico ecossistema de middleware para necessidades comuns de desenvolvimento web. Explore middleware contribuído pela comunidade:

- **[gin-contrib](https://github.com/gin-contrib)** - Coleção oficial de middleware incluindo:
  - Autenticação (JWT, Basic Auth, Sessões)
  - CORS, Rate limiting, Compressão
  - Logging, Métricas, Rastreamento
  - Servir arquivos estáticos, Motores de template

- **[gin-gonic/contrib](https://github.com/gin-gonic/contrib)** - Middleware adicional da comunidade
