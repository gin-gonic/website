---
title: "Introducción"
draft: false
weight: 1
---

Gin es un framework para desarrollo web escrito en Go (Golang). Cuenta con una API tipo martini, con un rendimiento mucho mayor, hasta 40 veces más rápido gracias a [httprouter](https://github.com/julienschmidt/httprouter). Si necesitas rendimiento y productividad amarás a Gin.

En esta sección veremos qué es Gin, qué problemas resuelve y cómo puede ayudar a tu proyecto.

O, si está listo para usar Gin en su proyecto, visita el [Inicio Rápido](https://gin-gonic.com/es/docs/quickstart/).

## Características

### Veloz

Enrutamiento basado en Radix tree, poco consumo de memoria. Sin reflection. Rendimiento predecible del API.

### Soporte de middleware

Una petición entrante HTTP puede ser manejada por diversos middleware encadenados y la acción final.
Ejemplo: Logger, Authorization, GZIP y por úlitmo guardar el mensaje en la BD.

### Libre de crashes

Gin puede recibir y recuperarse de un panic ocurrido durante una petición HTTP. Así tu servidor estará siempre disponible. También es posible hacer un reporte del panic, por ejemplo ¡a Sentry!

### Validación de JSON

Gin permite analizar y validar datos JSON en una petición, y por ejemplo, revisar la existencia de datos requeridos.

### Agrupación de rutas

Organiza mejor tus rutas: Rutas con autorización vs rutas públicas, versiones diferentes de API. Adicionalmente los grupos de rutas pueden anidarse ilimitadamente sin afectar el rendimiento.

### Manejo de errores

Gin ofrece una conveniente forma de recopilar los errores ocurridos durante una petición HTTP. Un middleware puede incluso registrarlos en un archivo de logs, la BD o enviarlos por la red.

### Render incluído

Gin cuenta con una API fácil de usar para el render de JSON, XML y HTML.

### Extensible

Crear un middleware nuevo es muy sencillo. Sólo debes revisar los códigos de ejemplo.
