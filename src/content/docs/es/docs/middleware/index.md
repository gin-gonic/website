---
title: "Middleware"
sidebar:
  order: 6
---

El middleware en Gin proporciona una forma de procesar solicitudes HTTP antes de que lleguen a los handlers de rutas. Una función middleware tiene la misma firma que un handler de ruta -- `gin.HandlerFunc` -- y típicamente llama a `c.Next()` para pasar el control al siguiente handler en la cadena.

## Cómo funciona el middleware

Gin usa un **modelo de cebolla** para la ejecución del middleware. Cada middleware se ejecuta en dos fases:

1. **Pre-handler** -- el código antes de `c.Next()` se ejecuta antes del handler de ruta.
2. **Post-handler** -- el código después de `c.Next()` se ejecuta después de que el handler de ruta retorna.

Esto significa que el middleware envuelve al handler como capas de una cebolla. El primer middleware adjunto es la capa más externa.

```go
func Logger() gin.HandlerFunc {
  return func(c *gin.Context) {
    start := time.Now()

    // Pre-handler phase
    c.Next()

    // Post-handler phase
    latency := time.Since(start)
    log.Printf("Request took %v", latency)
  }
}
```

## Adjuntar middleware

Hay tres formas de adjuntar middleware en Gin:

```go
// 1. Global -- applies to all routes
router := gin.New()
router.Use(Logger(), Recovery())

// 2. Group -- applies to all routes in the group
v1 := router.Group("/v1")
v1.Use(AuthRequired())
{
  v1.GET("/users", listUsers)
}

// 3. Per-route -- applies to a single route
router.GET("/benchmark", BenchmarkMiddleware(), benchHandler)
```

El middleware adjunto en un alcance más amplio se ejecuta primero. En el ejemplo anterior, una solicitud a `GET /v1/users` ejecutaría `Logger`, luego `Recovery`, luego `AuthRequired` y finalmente `listUsers`.

## En esta sección

- [**Usar middleware**](./using-middleware/) -- Adjuntar middleware globalmente, a grupos o rutas individuales
- [**Middleware personalizado**](./custom-middleware/) -- Escribir tus propias funciones middleware
- [**Usar middleware BasicAuth**](./using-basicauth/) -- Autenticación HTTP básica
- [**Goroutines dentro del middleware**](./goroutines-inside-middleware/) -- Ejecutar tareas en segundo plano de forma segura desde el middleware
- [**Configuración HTTP personalizada**](./custom-http-config/) -- Manejo de errores y recuperación en middleware
- [**Encabezados de seguridad**](./security-headers/) -- Establecer encabezados de seguridad comunes
