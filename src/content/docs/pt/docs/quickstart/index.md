---
title: "Guia Rápido"
sidebar:
  order: 2
---

Bem-vindo ao Guia Rápido do Gin! Este guia mostra passo a passo como instalar o Gin, configurar seu projeto e executar sua primeira API – tornando fácil começar no desenvolvimento de serviços web.

## Pré-requisitos

- **Versão do Go**: O Gin requer [Go](https://go.dev/) versão [1.24](https://go.dev/doc/devel/release#go1.24) ou superior
- Garanta que o Go está no seu `PATH` e pode ser usado no terminal. Para saber como instalar, veja a [documentação oficial](https://golang.org/doc/install).

---

## Passo 1: Instale o Gin e inicialize o projeto

Comece criando uma pasta para o projeto e inicialize o módulo Go:

```sh
mkdir gin-quickstart && cd gin-quickstart
go mod init gin-quickstart
```

Adicione o Gin como dependência:

```sh
go get -u github.com/gin-gonic/gin
```

---

## Passo 2: Crie sua primeira aplicação com Gin

Crie um arquivo chamado `main.go`:

```sh
touch main.go
```

Abra o `main.go` e insira o seguinte código:

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
  router.Run() // escuta em 0.0.0.0:8080 por padrão
}
```

---

## Passo 3: Execute o servidor API

Inicie o servidor executando:

```sh
go run main.go
```

Abra [http://localhost:8080/ping](http://localhost:8080/ping) em seu navegador e deverá ver:

```json
{"message":"pong"}
```

---

## Exemplo adicional: Usando net/http com Gin

Caso deseje usar constantes da biblioteca `net/http` para os códigos de resposta, importe-a também:

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

## Dicas e recursos

- Novo em Go? Aprenda a escrever e executar código Go [aqui](https://golang.org/doc/code.html).
- Quer praticar conceitos de Gin de forma interativa? Consulte nossos [Recursos de Aprendizagem](../learning-resources) para desafios interativos e tutoriais.
- Precisa de um exemplo mais completo? Use:

  ```sh
  curl https://raw.githubusercontent.com/gin-gonic/examples/master/basic/main.go > main.go
  ```

- Para documentação detalhada, acesse os [docs oficiais do Gin](https://github.com/gin-gonic/gin/blob/master/docs/doc.md).
