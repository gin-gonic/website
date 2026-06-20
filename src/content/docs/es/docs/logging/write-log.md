---
title: "Cómo escribir un archivo de log"
sidebar:
  order: 1
---

Escribir logs en un archivo es esencial para aplicaciones en producción donde necesitas retener el historial de solicitudes para depuración, auditoría o monitoreo. Por defecto, Gin escribe toda la salida de logs en `os.Stdout`. Puedes redirigir esto configurando `gin.DefaultWriter` antes de crear el enrutador.

```go
package main

import (
  "io"
  "os"

  "github.com/gin-gonic/gin"
)

func main() {
    // Disable Console Color, you don't need console color when writing the logs to file.
    gin.DisableConsoleColor()

    // Logging to a file.
    f, _ := os.Create("gin.log")
    gin.DefaultWriter = io.MultiWriter(f)

    // Use the following code if you need to write the logs to file and console at the same time.
    // gin.DefaultWriter = io.MultiWriter(f, os.Stdout)

    router := gin.Default()
    router.GET("/ping", func(c *gin.Context) {
        c.String(200, "pong")
    })

    router.Run(":8080")
}
```

### Escribir tanto en archivo como en consola

La función `io.MultiWriter` de la biblioteca estándar de Go acepta múltiples valores `io.Writer` y duplica las escrituras a todos ellos. Esto es útil durante el desarrollo cuando quieres ver los logs en la terminal mientras también los persistes en disco:

```go
f, _ := os.Create("gin.log")
gin.DefaultWriter = io.MultiWriter(f, os.Stdout)
```

Con esta configuración, cada entrada de log se escribe tanto en `gin.log` como en la consola simultáneamente.

### Rotación de logs en producción

El ejemplo anterior usa `os.Create`, que trunca el archivo de log cada vez que la aplicación inicia. En producción, típicamente quieres agregar a los logs existentes y rotar archivos basándote en tamaño o tiempo. Considera usar una biblioteca de rotación de logs como [lumberjack](https://github.com/natefinch/lumberjack):

```go
import "gopkg.in/natefinch/lumberjack.v2"

func main() {
    gin.DisableConsoleColor()

    gin.DefaultWriter = &lumberjack.Logger{
        Filename:   "gin.log",
        MaxSize:    100, // megabytes
        MaxBackups: 3,
        MaxAge:     28, // days
    }

    router := gin.Default()
    router.GET("/ping", func(c *gin.Context) {
        c.String(200, "pong")
    })

    router.Run(":8080")
}
```

### Ver también

- [Formato de log personalizado](../custom-log-format/) -- Definir tu propio formato de línea de log.
- [Controlar el color de la salida de logs](../controlling-log-output-coloring/) -- Deshabilitar o forzar la salida con color.
- [Omitir logging](../skip-logging/) -- Excluir rutas específicas del logging.
