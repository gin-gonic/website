---
title: "Inicio rápido"
sidebar:
  order: 2
---

¡Bienvenido al inicio rápido de Gin! Esta guía te lleva a través de la instalación de Gin, la configuración de un proyecto y la ejecución de tu primera API, para que puedas comenzar a construir servicios web con confianza.

## Requisitos previos

- **Versión de Go**: Gin requiere [Go](https://go.dev/) versión [1.25](https://go.dev/doc/devel/release#go1.25) o superior
- Confirma que Go está en tu `PATH` y es utilizable desde tu terminal. Para ayuda con la instalación de Go, [consulta la documentación oficial](https://go.dev/doc/install).

---

## Paso 1: Instalar Gin e inicializar tu proyecto

Comienza creando una nueva carpeta de proyecto e inicializando un módulo de Go:

```sh
mkdir gin-quickstart && cd gin-quickstart
go mod init gin-quickstart
```

Agrega Gin como dependencia:

```sh
go get -u github.com/gin-gonic/gin
```

---

## Paso 2: Crea tu primera aplicación Gin

Crea un archivo llamado `main.go`:

```sh
touch main.go
```

Abre `main.go` y agrega el siguiente código:

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

## Paso 3: Ejecuta tu servidor API

Inicia tu servidor con:

```sh
go run main.go
```

Navega a [http://localhost:8080/ping](http://localhost:8080/ping) en tu navegador, y deberías ver:

```json
{"message":"pong"}
```

---

## Ejemplo adicional: Usando net/http con Gin

Si deseas usar las constantes de `net/http` para los códigos de respuesta, impórtalo también:

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

## Consejos y recursos

- ¿Nuevo en Go? Aprende cómo escribir y ejecutar código Go en la [documentación oficial de Go](https://go.dev/doc/code).
- ¿Quieres practicar conceptos de Gin de forma práctica? Consulta nuestros [Recursos de aprendizaje](../learning-resources) para desafíos interactivos y tutoriales.
- ¿Necesitas un ejemplo completo? Intenta generar uno con:

  ```sh
  curl https://raw.githubusercontent.com/gin-gonic/examples/master/basic/main.go > main.go
  ```

- Para documentación más detallada, visita la [documentación del código fuente de Gin](https://github.com/gin-gonic/gin/blob/master/docs/doc.md).
