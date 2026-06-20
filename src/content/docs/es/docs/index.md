---
title: "Documentación"
sidebar:
  order: 20
---

Gin es un framework web HTTP de alto rendimiento escrito en [Go](https://go.dev/). Proporciona una API similar a Martini pero con un rendimiento significativamente mejor —hasta 40 veces más rápido— gracias a [httprouter](https://github.com/julienschmidt/httprouter). Gin está diseñado para construir APIs REST, aplicaciones web y microservicios donde la velocidad y la productividad del desarrollador son esenciales.

**¿Por qué elegir Gin?**

Gin combina la simplicidad del enrutamiento estilo Express.js con las características de rendimiento de Go, haciéndolo ideal para:

- Construir APIs REST de alto rendimiento
- Desarrollar microservicios que necesitan manejar muchas solicitudes concurrentes
- Crear aplicaciones web que requieren tiempos de respuesta rápidos
- Prototipar servicios web rápidamente con código mínimo

**Características clave de Gin:**

- **Enrutador sin asignaciones** - Enrutamiento extremadamente eficiente en memoria sin asignaciones en el heap
- **Alto rendimiento** - Los benchmarks muestran una velocidad superior en comparación con otros frameworks web de Go
- **Soporte de middleware** - Sistema de middleware extensible para autenticación, logging, CORS, etc.
- **Libre de fallos** - Middleware de recuperación incorporado que evita que los panics detengan tu servidor
- **Validación JSON** - Enlace y validación automática de JSON en solicitudes/respuestas
- **Agrupación de rutas** - Organiza rutas relacionadas y aplica middleware común
- **Gestión de errores** - Manejo y registro centralizado de errores
- **Renderizado incorporado** - Soporte para JSON, XML, plantillas HTML y más
- **Extensible** - Gran ecosistema de middleware y plugins de la comunidad

## Primeros pasos

### Requisitos previos

- **Versión de Go**: Gin requiere [Go](https://go.dev/) versión [1.25](https://go.dev/doc/devel/release#go1.25) o superior
- **Conocimiento básico de Go**: Es útil tener familiaridad con la sintaxis de Go y la gestión de paquetes

### Instalación

Con el [soporte de módulos de Go](https://go.dev/wiki/Modules#how-to-use-modules), simplemente importa Gin en tu código y Go lo descargará automáticamente durante la compilación:

```go
import "github.com/gin-gonic/gin"
```

### Tu primera aplicación Gin

Aquí tienes un ejemplo completo que demuestra la simplicidad de Gin:

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

**Ejecutar la aplicación:**

1. Guarda el código anterior como `main.go`
2. Ejecuta la aplicación:

   ```sh
   go run main.go
   ```

3. Abre tu navegador y visita [`http://localhost:8080/ping`](http://localhost:8080/ping)
4. Deberías ver: `{"message":"pong"}`

**Lo que demuestra este ejemplo:**

- Crear un enrutador Gin con middleware predeterminado
- Definir endpoints HTTP con funciones handler simples
- Devolver respuestas JSON
- Iniciar un servidor HTTP

### Siguientes pasos

Después de ejecutar tu primera aplicación Gin, explora estos recursos para aprender más:

#### Recursos de aprendizaje

- **[Guía de inicio rápido de Gin](./quickstart/)** - Tutorial completo con ejemplos de API y configuraciones de compilación
- **[Repositorio de ejemplos](https://github.com/gin-gonic/examples)** - Ejemplos listos para ejecutar que demuestran varios casos de uso de Gin:
  - Desarrollo de APIs REST
  - Autenticación y middleware
  - Carga y descarga de archivos
  - Conexiones WebSocket
  - Renderizado de plantillas

### Tutoriales oficiales

- [Tutorial de Go.dev: Desarrollando una API RESTful con Go y Gin](https://go.dev/doc/tutorial/web-service-gin)

## Ecosistema de middleware

Gin tiene un rico ecosistema de middleware para necesidades comunes de desarrollo web. Explora el middleware contribuido por la comunidad:

- **[gin-contrib](https://github.com/gin-contrib)** - Colección oficial de middleware que incluye:
  - Autenticación (JWT, Basic Auth, Sesiones)
  - CORS, Limitación de tasa, Compresión
  - Logging, Métricas, Rastreo
  - Servicio de archivos estáticos, Motores de plantillas

- **[gin-gonic/contrib](https://github.com/gin-gonic/contrib)** - Middleware adicional de la comunidad
