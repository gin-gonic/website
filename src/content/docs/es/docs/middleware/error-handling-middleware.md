---
title: "Middleware de manejo de errores"
sidebar:
  order: 4
---

En una aplicación RESTful típica, podrías encontrar errores en cualquier ruta como:

- Entrada inválida del usuario
- Fallos de base de datos
- Acceso no autorizado
- Errores internos del servidor

Por defecto, Gin te permite manejar errores manualmente en cada ruta usando `c.Error(err)`.
Pero esto puede volverse repetitivo e inconsistente rápidamente.

Para resolver esto, podemos usar middleware personalizado para manejar todos los errores en un solo lugar.
Este middleware se ejecuta después de cada solicitud y verifica si hay errores añadidos al contexto de Gin (`c.Errors`).
Si encuentra uno, envía una respuesta JSON estructurada con un código de estado apropiado.

#### Ejemplo

```go
import (
  "errors"
  "net/http"
  "github.com/gin-gonic/gin"
)

// ErrorHandler captures errors and returns a consistent JSON error response
func ErrorHandler() gin.HandlerFunc {
    return func(c *gin.Context) {
        c.Next() // Step1: Process the request first.

        // Step2: Check if any errors were added to the context
        if len(c.Errors) > 0 {
            // Step3: Use the last error
            err := c.Errors.Last().Err

            // Step4: Respond with a generic error message
            c.JSON(http.StatusInternalServerError, map[string]any{
                "success": false,
                "message": err.Error(),
            })
        }

        // Any other steps if no errors are found
    }
}

func main() {
    r := gin.Default()

    // Attach the error-handling middleware
    r.Use(ErrorHandler())

    r.GET("/ok", func(c *gin.Context) {
        somethingWentWrong := false

        if somethingWentWrong {
            c.Error(errors.New("something went wrong"))
            return
        }

        c.JSON(http.StatusOK, gin.H{
            "success": true,
            "message": "Everything is fine!",
        })
    })

    r.GET("/error", func(c *gin.Context) {
        somethingWentWrong := true

        if somethingWentWrong {
            c.Error(errors.New("something went wrong"))
            return
        }

        c.JSON(http.StatusOK, gin.H{
            "success": true,
            "message": "Everything is fine!",
        })
    })

    r.Run()
}

```

#### Extensiones

- Mapear errores a códigos de estado
- Generar diferentes respuestas de error basadas en códigos de error
- Registrar errores usando logging

#### Beneficios del middleware de manejo de errores

- **Consistencia**: Todos los errores siguen el mismo formato
- **Rutas limpias**: La lógica de negocio se separa del formato de errores
- **Menos duplicación**: No es necesario repetir la lógica de manejo de errores en cada handler
