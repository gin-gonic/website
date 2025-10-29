---
title: "Inicio Rápido"
sidebar:
  order: 2
---

¡Bienvenido a la guía rápida de Gin! Esta guía te lleva paso a paso por la instalación de Gin, la configuración de tu proyecto y la creación de tu primera API, para que empieces a construir servicios web con confianza.

## Prerrequisitos

- **Go**: Debes tener instalada la versión 1.23 o superior.
- Asegúrate de que Go esté en tu `PATH` y que puedas usarlo en la terminal. Si necesitas ayuda para instalarlo, [consulta la documentación oficial](https://golang.org/doc/install).

---

## Paso 1: Instala Gin e inicializa tu proyecto

Primero, crea una nueva carpeta para tu proyecto e inicializa un módulo de Go:

```sh
mkdir gin-quickstart && cd gin-quickstart
go mod init gin-quickstart
```

Agrega Gin como dependencia:

```sh
go get -u github.com/gin-gonic/gin
```

---

## Paso 2: Crea tu primera app con Gin

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
  router.Run() // escucha en 0.0.0.0:8080 por defecto
}
```

---

## Paso 3: Ejecuta tu servidor API

Inicia el servidor con:

```sh
go run main.go
```

Abre [http://localhost:8080/ping](http://localhost:8080/ping) en tu navegador y deberías ver:

```json
{"message":"pong"}
```

---

## Ejemplo adicional: Usar net/http con Gin

Si quieres usar constantes de `net/http` para los códigos de respuesta, impórtalo también:

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

- ¿Nuevo en Go? Aprende cómo escribir y ejecutar código Go [aquí](https://golang.org/doc/code.html).
- ¿Quieres practicar conceptos de Gin de forma interactiva? Consulta nuestros [Recursos de Aprendizaje](../learning-resources) para desafíos y tutoriales interactivos.
- ¿Quieres un ejemplo más completo? Puedes usar:

  ```sh
  curl https://raw.githubusercontent.com/gin-gonic/examples/master/basic/main.go > main.go
  ```

- Para documentación detallada, visita los [docs del código fuente de Gin](https://github.com/gin-gonic/gin/blob/master/docs/doc.md).
