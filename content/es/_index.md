---
title: Gin Web Framework
linkTitle: Gin Web Framework
---

{{< blocks/cover title="Gin Web Framework" image_anchor="top" height="full" >}}
<a class="btn btn-lg btn-primary me-3 mb-4" href="/docs/"> Ver Más
<i class="fas fa-arrow-alt-circle-right ms-2"></i> </a>
<a class="btn btn-lg btn-secondary text-dark me-3 mb-4" href="https://github.com/gin-gonic/gin/releases">
Descargar <i class="fab fa-github ms-2 "></i> </a>

<p class="lead mt-5">Claramente, el framework más rápido para desarrollo web en Go.</p>

{{< blocks/link-down color="info" >}} {{< /blocks/cover >}}

{{% blocks/lead color="white" %}}

**¿Qué es Gin?**

Gin es un framework para desarrollo web escrito en Golang. Cuenta con una API
tipo martini con un rendimiento mucho mayor, hasta 40 veces más rápido.

Si necesitas rendimiento y productividad amarás a Gin.

{{% /blocks/lead %}}

{{% blocks/section color="light" type="row" %}}
{{% blocks/feature icon="fa-tachometer-alt" title="Veloz" %}}

Enrutamiento basado en Radix tree, poco consumo de memoria. Sin reflection.
Rendimiento predecible del API.

{{% /blocks/feature %}}

{{% blocks/feature icon="fa-bars" title="Soporte de middleware"%}}

Una petición entrante HTTP puede ser manejada por diversos middleware
encadenados y la acción final. Ejemplo: Logger, Authorization, GZIP y por úlitmo
guardar el mensaje en la BD.

{{% /blocks/feature %}}

{{% blocks/feature icon="fa-life-ring" title="Libre de crashes"%}}

Gin puede recibir y recuperarse de un panic ocurrido durante una petición HTTP.
Así tu servidor estará siempre disponible. También es posible hacer un reporte
del panic, por ejemplo ¡a Sentry!

{{% /blocks/feature %}}

{{% /blocks/section %}}

{{% blocks/section color="white" type="row" %}}
{{% blocks/feature icon="fa-check-circle" title="Validación de JSON" %}}

Gin permite analizar y validar datos JSON en una petición, y por ejemplo,
revisar la existencia de datos requeridos.

{{% /blocks/feature %}}

{{% blocks/feature icon="fa-users-cog" title="Agrupación de rutas"%}}

Organiza mejor tus rutas: Rutas con autorización vs rutas públicas, versiones
diferentes de API. Adicionalmente los grupos de rutas pueden anidarse
ilimitadamente sin afectar el rendimiento.

{{% /blocks/feature %}}

{{% blocks/feature icon="fa-briefcase" title="Manejo de errores"%}}

Gin ofrece una conveniente forma de recopilar los errores ocurridos durante una
petición HTTP. Un middleware puede incluso registrarlos en un archivo de logs,
la BD o enviarlos por la red.

{{% /blocks/feature %}}

{{% /blocks/section %}}

{{% blocks/section color="info" type="row" %}}

{{% blocks/feature icon="fa-images" title="Render incluído" %}}

Gin cuenta con una API fácil de usar para el render de JSON, XML y HTML.

{{% /blocks/feature %}}

{{% blocks/feature icon="fa-code" title="Extensible" %}}

Crear un middleware nuevo es muy sencillo. Sólo debes revisar los códigos de
ejemplo.

{{% /blocks/feature %}}

{{% /blocks/section %}}
