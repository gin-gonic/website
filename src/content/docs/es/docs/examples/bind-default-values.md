---
title: "Vincular valores predeterminados para campos de formulario"
---

A veces deseas que un campo use un valor predeterminado cuando el cliente no envía un valor. El enlace de formularios de Gin admite valores predeterminados a través de la opción `default` en la etiqueta de estructura `form`. Esto funciona para escalares y, a partir de Gin v1.11, para colecciones (slices/arrays) con formatos de colección explícitos.

Puntos clave:

- Coloca el valor predeterminado justo después de la clave del formulario: `form:"name,default=William"`.
- Para colecciones, especifica cómo dividir los valores con `collection_format:"multi|csv|ssv|tsv|pipes"`.
- Para `multi` y `csv`, usa punto y coma en el valor predeterminado para separar los valores (por ejemplo, `default=1;2;3`). Gin los convierte internamente a comas para que el analizador de etiquetas no sea ambiguo.
- Para `ssv` (espacio), `tsv` (tabulación) y `pipes` (|), usa el separador natural en el valor predeterminado.

Ejemplo:

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

type Person struct {
  Name      string    `form:"name,default=William"`
  Age       int       `form:"age,default=10"`
  Friends   []string  `form:"friends,default=Will;Bill"`                     // multi/csv: usa ; en los valores predeterminados
  Addresses [2]string `form:"addresses,default=foo bar" collection_format:"ssv"`
  LapTimes  []int     `form:"lap_times,default=1;2;3" collection_format:"csv"`
}

func main() {
  r := gin.Default()
  r.POST("/person", func(c *gin.Context) {
    var req Person
    if err := c.ShouldBind(&req); err != nil { // infiere el binder por Content-Type
      c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      return
    }
    c.JSON(http.StatusOK, req)
  })
  _ = r.Run(":8080")
}
```

Si haces un POST sin cuerpo, Gin responde con los valores predeterminados:

```sh
curl -X POST http://localhost:8080/person
```

Respuesta (ejemplo):

```json
{
  "Name": "William",
  "Age": 10,
  "Friends": ["Will", "Bill"],
  "Addresses": ["foo", "bar"],
  "LapTimes": [1, 2, 3]
}
```

Notas y advertencias:

- Las comas se usan en la sintaxis de etiquetas de estructuras de Go para separar opciones; evita las comas dentro de los valores predeterminados.
- Para `multi` y `csv`, los punto y coma separan los valores predeterminados; no incluyas punto y coma dentro de los valores predeterminados individuales para estos formatos.
- Los valores inválidos de `collection_format` resultarán en un error de enlace.

Cambios relacionados:

- Los formatos de colección para el enlace de formularios (`multi`, `csv`, `ssv`, `tsv`, `pipes`) fueron mejorados alrededor de v1.11.
- Los valores predeterminados para colecciones fueron agregados en v1.11 (PR #4048).
