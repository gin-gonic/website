---
title: "Controlar el color del texto del Log en cónsola"
draft: false
---

Por defecto la la salida en cónsola puede tener color, dependiendo del TTY detectado.

Definir logs monocromáticos:

```go
func main() {
    // Deshabilita el color del log
    gin.DisableConsoleColor()
    
    // Crea un route de gin con middleware por defecto:
    // logger y recovery (crash-free) middleware
    router := gin.Default()
    
    router.GET("/ping", func(c *gin.Context) {
        c.String(200, "pong")
    })
    // Escucha y sirve peticiones en 0.0.0.0:8080
    router.Run(":8080")
}
```

Definir logs siempre colorizados:

```go
func main() {
    // Obliga a generar logs siempre con colores
    gin.ForceConsoleColor()
    
    // Crea un route de gin con middleware por defecto:
    // logger y recovery (crash-free) middleware
    router := gin.Default()
    
    router.GET("/ping", func(c *gin.Context) {
        c.String(200, "pong")
    })
    // Escucha y sirve peticiones en 0.0.0.0:8080
    router.Run(":8080")
}
```
