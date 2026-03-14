---
title: "Enrutamiento"
sidebar:
  order: 3
---

Gin proporciona un potente sistema de enrutamiento basado en [httprouter](https://github.com/julienschmidt/httprouter) para coincidencia de URL de alto rendimiento. Internamente, httprouter utiliza un [árbol radix](https://en.wikipedia.org/wiki/Radix_tree) (también llamado trie comprimido) para almacenar y buscar rutas, lo que significa que la coincidencia de rutas es extremadamente rápida y no requiere asignaciones de memoria por búsqueda. Esto convierte a Gin en uno de los frameworks web de Go más rápidos disponibles.

Las rutas se registran llamando a un método HTTP en el motor (o un grupo de rutas) y proporcionando un patrón de URL junto con una o más funciones handler:

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.GET("/hello", func(c *gin.Context) {
    c.String(http.StatusOK, "Hello, World!")
  })

  router.POST("/users", func(c *gin.Context) {
    name := c.PostForm("name")
    c.JSON(http.StatusCreated, gin.H{"user": name})
  })

  router.Run(":8080")
}
```

## En esta sección

Las siguientes páginas cubren cada tema de enrutamiento en detalle:

- [**Uso de métodos HTTP**](./http-method/) -- Registrar rutas para GET, POST, PUT, DELETE, PATCH, HEAD y OPTIONS.
- [**Parámetros en la ruta**](./param-in-path/) -- Capturar segmentos dinámicos de las rutas URL (ej. `/user/:name`).
- [**Parámetros de cadena de consulta**](./querystring-param/) -- Leer valores de la cadena de consulta de la URL de la solicitud.
- [**Consulta y formulario post**](./query-and-post-form/) -- Acceder tanto a la cadena de consulta como a los datos del formulario POST en el mismo handler.
- [**Map como cadena de consulta o postform**](./map-as-querystring-or-postform/) -- Vincular parámetros de mapa desde cadenas de consulta o formularios POST.
- [**Formulario multipart/urlencoded**](./multipart-urlencoded-form/) -- Analizar cuerpos `multipart/form-data` y `application/x-www-form-urlencoded`.
- [**Subir archivos**](./upload-file/) -- Manejar la subida de archivos individuales y múltiples.
- [**Agrupación de rutas**](./grouping-routes/) -- Organizar rutas bajo prefijos comunes con middleware compartido.
- [**Redirecciones**](./redirects/) -- Realizar redirecciones HTTP y a nivel de enrutador.
