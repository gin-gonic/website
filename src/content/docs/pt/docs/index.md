---
title: "Documentação"
sidebar:
  order: 20
---

Gin é um framework web HTTP de alto desempenho escrito em [Go](https://go.dev/). Ele oferece uma API similar ao Martini com desempenho significativamente superior—até 40 vezes mais rápido—graças ao [httprouter](https://github.com/julienschmidt/httprouter). Gin é projetado para construir APIs REST, aplicações web e microsserviços onde velocidade e produtividade do desenvolvedor são essenciais.

**Por que escolher o Gin?**

Gin combina a simplicidade do roteamento estilo Express.js com as características de desempenho do Go, tornando-o ideal para:

- Construir APIs REST de alta performance
- Desenvolver microsserviços que precisam lidar com muitas requisições concorrentes
- Criar aplicações web que exigem respostas rápidas
- Prototipar serviços web rapidamente com pouquíssimo boilerplate

**Principais recursos do Gin:**

- **Router sem alocação de memória** – Roteamento extremamente eficiente em memória sem alocações de heap
- **Alta performance** – Benchmarks mostram velocidade superior em relação a outros frameworks Go
- **Suporte a middleware** – Sistema extensível para autenticação, logs, CORS, etc.
- **Crash-free** – Middleware de recuperação incorporado evita que pânicos derrubem o seu servidor
- **Validação JSON** – Binding automático e validação para requests/respostas JSON
- **Agrupamento de rotas** – Organize rotas relacionadas e aplique middlewares compartilhados
- **Gestão de erros** – Manipulação e logging centralizados
- **Renderização integrada** – Suporte para JSON, XML, templates HTML e mais
- **Extensível** – Grande ecossistema de middlewares e plugins da comunidade

## Primeiros Passos

### Pré-requisitos

- **Versão do Go:** Gin requer [Go](https://go.dev/) versão [1.23](https://go.dev/doc/devel/release#go1.23.0) ou superior
- **Conhecimento básico de Go:** Familiaridade com a sintaxe da linguagem e gerenciamento de pacotes é útil

### Instalação

Com o [suporte a módulos do Go](https://go.dev/wiki/Modules#how-to-use-modules), basta importar o Gin no seu código que o Go irá buscar automaticamente durante o build:

```go
import "github.com/gin-gonic/gin"
```

### Sua primeira aplicação Gin

Aqui está um exemplo completo que mostra como Gin é simples:

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  // Crie um roteador Gin com os middlewares padrão (logger e recovery)
  r := gin.Default()
  
  // Defina um endpoint GET simples
  r.GET("/ping", func(c *gin.Context) {
    // Retorna resposta JSON
    c.JSON(http.StatusOK, gin.H{
      "message": "pong",
    })
  })
  
  // Inicie o servidor na porta 8080 (padrão)
  // O servidor escutará em 0.0.0.0:8080 (localhost:8080 no Windows)
  r.Run()
}
```

**Executando a aplicação:**

1. Salve o código acima como `main.go`
2. Rode a aplicação:

   ```sh
   go run main.go
   ```

3. Abra o navegador e visite [`http://localhost:8080/ping`](http://localhost:8080/ping)
4. Você verá: `{"message":"pong"}`

**O que esse exemplo mostra:**

- Criando um roteador Gin com middlewares padrão
- Definindo endpoints HTTP com funções simples
- Retornando respostas JSON
- Inicializando um servidor HTTP

### Próximos Passos

Depois de rodar sua primeira aplicação com Gin, explore os seguintes recursos para aprender mais:

#### 📚 Recursos de Aprendizagem

- **[Guia Rápido do Gin](./quickstart/)** – Tutorial completo com exemplos de API e configurações de build
- **[Repositório de exemplos](https://github.com/gin-gonic/examples)** – Exemplos prontos para uso demonstrando diversos casos com Gin:
  - Desenvolvimento de APIs REST
  - Autenticação e middlewares
  - Upload e download de arquivos
  - Conexão WebSocket
  - Renderização de templates

### Tutoriais Oficiais

- [Tutorial Go.dev: Desenvolvendo uma API RESTful com Go e Gin](https://go.dev/doc/tutorial/web-service-gin)

## 🔌 Ecossistema de Middleware

Gin possui um ecossistema rico de middlewares para as necessidades comuns de desenvolvimento web. Explore middlewares comunitários:

- **[gin-contrib](https://github.com/gin-contrib)** – Coleção oficial de middlewares, incluindo:
  - Autenticação (JWT, Basic Auth, Sessão)
  - CORS, limitação de taxa, compressão
  - Logging, métricas, tracing
  - Servir arquivos estáticos, motores de template
  
- **[gin-gonic/contrib](https://github.com/gin-gonic/contrib)** – Middlewares adicionais da comunidade
