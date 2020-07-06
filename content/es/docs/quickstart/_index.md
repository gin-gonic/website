---
title: "Inicio Rápido"
draft: false
weight: 2
---

En este inicio rápido, captaremos información y aprenderemos por medio de porciones de código:

## Requerimientos

- Go 1.9 o superior

> Las versiones de Go 1.7 ó Go 1.8 dejarán de ser compatibles pronto.

## Instalación

Para instalar Gin, primero debe instalar Go y configurar el espacio de trabajo Go.

1. Descargar e instalar:

```sh
$ go get -u github.com/gin-gonic/gin
```

2. Importar en el código:

```go
import "github.com/gin-gonic/gin"
```

3. Importar el paquete `net/http` (Opcional). Es requerido para el uso de constantes como por ejemplo `http.StatusOK`.

```go
import "net/http"
```

1. Crear la carpeta del proyecto e ingresar en ella con `cd`

```sh
$ mkdir -p $GOPATH/src/github.com/myusername/project && cd "$_"
```

2. Copiar una plantilla de inicio dentro del proyecto

```sh
$ curl https://raw.githubusercontent.com/gin-gonic/examples/master/basic/main.go > main.go
```

3. Ejecutar el proyecto

```sh
$ go run main.go
```

## Primeros Pasos

> ¿No sabes cómo escribir y ejecutar código Go? [Click aquí](https://golang.org/doc/code.html).

Primero, crear un archivo llamado `example.go`:

```sh
# asumimos que el código siguiente se encontrará en el archivo example.go
$ touch example.go
```

A continuación, coloque el siguiente código dentro en `example.go`:

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
	r.Run() // Sirve y escucha peticiones en 0.0.0.0:8080
}
```

Y ahora, puede ejecutar el código a través de `go run example.go`:

```sh
# ejecuta example.go y visita 0.0.0.0:8080/ping en el navegador
$ go run example.go
```

