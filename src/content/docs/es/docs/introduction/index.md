---
title: "Introducción"
sidebar:
  order: 1
---

Gin es un framework web escrito en Go (Golang). Cuenta con una API similar a Martini con un rendimiento mucho mejor, hasta 40 veces más rápido gracias a [httprouter](https://github.com/julienschmidt/httprouter). Si necesitas rendimiento y buena productividad, te encantará Gin.

En esta sección explicaremos qué es Gin, qué problemas resuelve y cómo puede ayudar a tu proyecto.

O, si ya estás listo para usar Gin en tu proyecto, visita el [Inicio rápido](https://gin-gonic.com/es/docs/quickstart/).

## Características

### Rápido

Enrutamiento basado en árboles radix, bajo consumo de memoria. Sin reflexión. Rendimiento de API predecible.

### Soporte de middleware

Una solicitud HTTP entrante puede ser procesada por una cadena de middlewares y la acción final.
Por ejemplo: Logger, Autorización, GZIP y finalmente publicar un mensaje en la BD.

### Libre de fallos

Gin puede capturar un panic ocurrido durante una solicitud HTTP y recuperarse. De esta manera, tu servidor siempre estará disponible. Como ejemplo, ¡también es posible reportar este panic a Sentry!

### Validación JSON

Gin puede analizar y validar el JSON de una solicitud, por ejemplo, verificando la existencia de valores requeridos.

### Agrupación de rutas

Organiza mejor tus rutas. Con autorización requerida vs no requerida, diferentes versiones de API... Además, los grupos pueden anidarse ilimitadamente sin degradar el rendimiento.

### Gestión de errores

Gin proporciona una forma conveniente de recopilar todos los errores ocurridos durante una solicitud HTTP. Eventualmente, un middleware puede escribirlos en un archivo de log, en una base de datos y enviarlos a través de la red.

### Renderizado incorporado

Gin proporciona una API fácil de usar para el renderizado de JSON, XML y HTML.

### Extensible

Crear un nuevo middleware es muy fácil, solo revisa el código de ejemplo.

## Gin v1. Estable

- Enrutador sin asignaciones de memoria.
- Sigue siendo el enrutador y framework HTTP más rápido. Desde el enrutamiento hasta la escritura.
- Suite completa de pruebas unitarias.
- Probado en batalla.
- API congelada, las nuevas versiones no romperán tu código.
