---
title: "Servir datos desde reader"
sidebar:
  order: 8
---

`DataFromReader` te permite transmitir datos desde cualquier `io.Reader` directamente a la respuesta HTTP sin almacenar todo el contenido en memoria primero. Esto es esencial para construir endpoints proxy o servir archivos grandes desde fuentes remotas de manera eficiente.

**Casos de uso comunes:**

- **Proxy de recursos remotos** -- Obtener un archivo de un servicio externo (como una API de almacenamiento en la nube o CDN) y reenviarlo al cliente. Los datos fluyen a través de tu servidor sin cargarse completamente en memoria.
- **Servir contenido generado** -- Transmitir datos generados dinámicamente (como exportaciones CSV o archivos de reporte) a medida que se producen.
- **Descargas de archivos grandes** -- Servir archivos que son demasiado grandes para mantener en memoria, leyéndolos en fragmentos desde disco o desde una fuente remota.

La firma del método es `c.DataFromReader(code, contentLength, contentType, reader, extraHeaders)`. Proporcionas el código de estado HTTP, la longitud del contenido (para que el cliente sepa el tamaño total), el tipo MIME, el `io.Reader` desde el cual transmitir, y un mapa opcional de encabezados de respuesta adicionales (como `Content-Disposition` para descargas de archivos).

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()
  router.GET("/someDataFromReader", func(c *gin.Context) {
    response, err := http.Get("https://raw.githubusercontent.com/gin-gonic/logo/master/color.png")
    if err != nil || response.StatusCode != http.StatusOK {
      c.Status(http.StatusServiceUnavailable)
      return
    }

    reader := response.Body
    contentLength := response.ContentLength
    contentType := response.Header.Get("Content-Type")

    extraHeaders := map[string]string{
      "Content-Disposition": `attachment; filename="gopher.png"`,
    }

    c.DataFromReader(http.StatusOK, contentLength, contentType, reader, extraHeaders)
  })
  router.Run(":8080")
}
```

En este ejemplo, Gin obtiene una imagen de GitHub y la transmite directamente al cliente como un adjunto descargable. Los bytes de la imagen fluyen desde el cuerpo de la respuesta HTTP upstream hasta la respuesta del cliente sin acumularse en un buffer. Ten en cuenta que `response.Body` se cierra automáticamente por el servidor HTTP después de que el handler retorna, ya que `DataFromReader` lo lee completamente durante la escritura de la respuesta.
