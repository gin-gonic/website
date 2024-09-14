---
title: "Introdução Rápida"

sidebar:
  order: 2
---

Nesta introdução rápida, recolheremos entendimentos a partir de segmentos de código e aprenderemos a como:

## Requisitos

- Go 1.13 ou superior

## Instalação

Para instalar o pacote de Gin, precisas de instalar a Go e definir a tua área de trabalho de Go primeiro:

1. Descarregue e instale-o:

```sh
$ go get -u github.com/gin-gonic/gin
```

2. Importe-o no teu código:

```go
import "github.com/gin-gonic/gin"
```

3. (Opcional) Importe `net/http`. Isto é obrigatório para por exemplo se estiveres a usar constantes tais como `http.StatusOk`:

```go
import "net/http"
```

1. Crie a pasta do teu projeto e entre dentro dela com `cd`:

```sh
$ mkdir -p $GOPATH/src/github.com/myusername/project && cd "$_"
```

2. Copie um modelo de partida dentro do teu projeto:

```sh
$ curl https://raw.githubusercontent.com/gin-gonic/examples/master/basic/main.go > main.go
```

3. Execute o teu projeto:

```sh
$ go run main.go
```

## Começar

> Inseguro de como escrever e executar o código de Go? [Clique nesta ligação](https://golang.org/doc/code.html).

Primeiro, crie um ficheiro chamado `example.go`:

```sh
# presuma os seguintes códigos no ficheiro `example.go`
$ touch example.go
```

A seguir, coloque o seguinte código dentro do `example.go`:

```go
package main

import "github.com/gin-gonic/gin"

func main() {
	r := gin.Default()
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})
	r.Run() // oiça e sirva na `0.0.0.0:8080`
}
```

E, podes executar o código através de `go run example.go`:

```sh
# execute `example.go` e visite `0.0.0.0:8080/ping` no navegador
$ go run example.go
```
