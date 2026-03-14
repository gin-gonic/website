---
title: "Início Rápido"
sidebar:
  order: 2
---

Bem-vindo ao início rápido do Gin! Este guia apresenta a instalação do Gin, a configuração de um projeto e a execução da sua primeira API — para que você possa começar a construir serviços web com confiança.

## Pré-requisitos

- **Versão do Go**: O Gin requer [Go](https://go.dev/) versão [1.25](https://go.dev/doc/devel/release#go1.25) ou superior
- Confirme que o Go está no seu `PATH` e utilizável a partir do seu terminal. Para ajuda com a instalação do Go, [consulte a documentação oficial](https://go.dev/doc/install).

---

## Passo 1: Instale o Gin e Inicialize Seu Projeto

Comece criando uma nova pasta de projeto e inicializando um módulo Go:

```sh
mkdir gin-quickstart && cd gin-quickstart
go mod init gin-quickstart
```

Adicione o Gin como dependência:

```sh
go get -u github.com/gin-gonic/gin
```

---

## Passo 2: Crie Sua Primeira Aplicação Gin

Crie um arquivo chamado `main.go`:

```sh
touch main.go
```

Abra o `main.go` e adicione o seguinte código:

```go
package main

import "github.com/gin-gonic/gin"

func main() {
  router := gin.Default()
  router.GET("/ping", func(c *gin.Context) {
    c.JSON(200, gin.H{
      "message": "pong",
    })
  })
  router.Run() // listens on 0.0.0.0:8080 by default
}
```

---

## Passo 3: Execute Seu Servidor de API

Inicie seu servidor com:

```sh
go run main.go
```

Acesse [http://localhost:8080/ping](http://localhost:8080/ping) no seu navegador, e você deverá ver:

```json
{"message":"pong"}
```

---

## Exemplo Adicional: Usando net/http com Gin

Se você quiser usar as constantes do `net/http` para códigos de resposta, importe-o também:

```go
package main

import (
  "github.com/gin-gonic/gin"
  "net/http"
)

func main() {
  router := gin.Default()
  router.GET("/ping", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{
      "message": "pong",
    })
  })
  router.Run()
}
```

---

## Dicas e Recursos

- Novo no Go? Aprenda como escrever e executar código Go na [documentação oficial do Go](https://go.dev/doc/code).
- Quer praticar conceitos do Gin de forma prática? Confira nossos [Recursos de Aprendizado](../learning-resources) para desafios interativos e tutoriais.
- Precisa de um exemplo completo? Tente criar um scaffold com:

  ```sh
  curl https://raw.githubusercontent.com/gin-gonic/examples/master/basic/main.go > main.go
  ```

- Para documentação mais detalhada, visite a [documentação do código-fonte do Gin](https://github.com/gin-gonic/gin/blob/master/docs/doc.md).
