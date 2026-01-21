---
title: "🍳 Recetas de Gin (Libro de cocina)"
sidebar:
  order: 6
---

## Introducción

Esta sección muestra **cómo usar Gin en tu código** a través de pequeñas recetas prácticas.
Cada receta se centra en un **único concepto** para que puedas aprender rápido y aplicarlo de inmediato.

Usa estos ejemplos como referencia para estructurar APIs del mundo real usando Gin.

---

## 🧭 Lo que aprenderás

En esta sección, encontrarás ejemplos que cubren:

- **Conceptos básicos del servidor**: Ejecutar un servidor, enrutamiento y configuración.
- **Manejo de solicitudes**: Vincular datos JSON, XML y de formularios.
- **Middleware**: Usar middleware incorporado y personalizado.
- **Renderización**: Servir HTML, JSON, XML y más.
- **Seguridad**: Manejar SSL, encabezados y autenticación.

---

## 🥇 Receta 1: Servidor Gin Mínimo

**Objetivo:** Iniciar un servidor Gin y manejar una solicitud básica.

### Pasos

1. Crear un enrutador
2. Definir una ruta
3. Iniciar el servidor

```go
package main

import "github.com/gin-gonic/gin"

func main() {
  r := gin.Default()

  r.GET("/ping", func(c *gin.Context) {
    c.JSON(200, gin.H{
      "message": "pong",
    })
  })

  r.Run(":8080") // http://localhost:8080
}
```
