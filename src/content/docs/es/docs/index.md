---
title: "Documentación"
sidebar:
  order: 20
---

Gin es un framework web HTTP de alto rendimiento escrito en [Go](https://go.dev/). Proporciona una API similar a Martini pero con un rendimiento significativamente superior—hasta 40 veces más rápido—gracias a [httprouter](https://github.com/julienschmidt/httprouter). Gin está diseñado para construir APIs REST, aplicaciones web y microservicios donde la velocidad y la productividad del desarrollador son esenciales.

**¿Por qué elegir Gin?**

Gin combina la simplicidad del enrutamiento estilo Express.js con las características de rendimiento de Go, lo que lo convierte en ideal para:

- Construir APIs REST de alto rendimiento
- Desarrollar microservicios que gestionan muchas solicitudes concurrentes
- Crear aplicaciones web que requieren tiempos de respuesta rápidos
- Prototipar servicios web rápidamente con mínima configuración

**Características clave de Gin:**

- **Router sin asignación de memoria** - Enrutamiento extremadamente eficiente en memoria sin asignaciones en heap
- **Alto rendimiento** - Benchmarks muestran velocidad superior comparada con otros frameworks web de Go
- **Soporte para middleware** - Sistema extensible de middleware para autenticación, registro, CORS, etc.
- **Sin bloqueos por errores** - Middleware de recuperación incorporado evita que los pánicos derriben el servidor
- **Validación JSON** - Vinculación y validación automática de peticiones/respuestas JSON
- **Agrupación de rutas** - Organiza rutas relacionadas y aplica middleware común
- **Gestión de errores** - Manejo y registro centralizado de errores
- **Renderizado integrado** - Soporte para JSON, XML, plantillas HTML y más
- **Extensible** - Gran ecosistema de middleware y plugins comunitarios

## Comenzando

### Requisitos previos

- **Versión Go:** Gin requiere [Go](https://go.dev/) versión [1.23](https://go.dev/doc/devel/release#go1.23.0) o superior
- **Conocimiento básico de Go:** Familiaridad con la sintaxis de Go y gestión de paquetes es útil

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
  // Crea un router Gin con middleware por defecto (logger y recovery)
  r := gin.Default()
  
  // Define un endpoint GET sencillo
  r.GET("/ping", func(c *gin.Context) {
    // Devuelve respuesta JSON
    c.JSON(http.StatusOK, gin.H{
      "message": "pong",
    })
  })
  
  // Inicia el servidor en el puerto 8080 (por defecto)
  // El servidor escuchará en 0.0.0.0:8080 (localhost:8080 en Windows)
  r.Run()
}
```

**Ejecución de la aplicación:**

1. Guarda el código anterior como `main.go`
2. Ejecuta la aplicación:

   ```sh
   go run main.go
   ```

3. Abre tu navegador y visita [`http://localhost:8080/ping`](http://localhost:8080/ping)
4. Deberías ver: `{"message":"pong"}`

**¿Qué muestra este ejemplo?**

- Crear un router Gin con middleware por defecto
- Definir endpoints HTTP con funciones manejadoras simples
- Devolver respuestas JSON
- Iniciar un servidor HTTP

### Siguientes pasos

Después de ejecutar tu primera aplicación Gin, explora estos recursos para aprender más:

#### 📚 Recursos de aprendizaje

- **[Guía Rápida de Gin](./quickstart/)** - Tutorial comprensivo con ejemplos de API y configuraciones de compilación
- **[Repositorio de ejemplos](https://github.com/gin-gonic/examples)** - Ejemplos listos para ejecutar que demuestran varios casos de uso de Gin:
  - Desarrollo de APIs REST
  - Autenticación y middleware
  - Carga y descarga de archivos
  - Conexiones WebSocket
  - Renderizado de plantillas

### Tutoriales oficiales

- [Tutorial Go.dev: Desarrollar una API RESTful con Go y Gin](https://go.dev/doc/tutorial/web-service-gin)

## 🔌 Ecosistema de middleware

Gin tiene un rico ecosistema de middleware para necesidades comunes de desarrollo web. Explora los middleware contribuidos por la comunidad:

- **[gin-contrib](https://github.com/gin-contrib)** - Colección oficial de middleware incluyendo:
  - Autenticación (JWT, Basic Auth, Sesiones)
  - CORS, limitación de tasa, compresión
  - Registro, métricas, trazabilidad
  - Servir archivos estáticos, motores de plantillas
  
- **[gin-gonic/contrib](https://github.com/gin-gonic/contrib)** - Middleware adicional de la comunidad
