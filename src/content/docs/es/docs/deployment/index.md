---
title: "Despliegue"
sidebar:
  order: 10
---

Los proyectos Gin pueden desplegarse fácilmente en cualquier proveedor de nube.

## [Railway](https://www.railway.com)

Railway es una plataforma de desarrollo en la nube de vanguardia para desplegar, gestionar y escalar aplicaciones y servicios. Simplifica tu stack de infraestructura desde servidores hasta observabilidad con una plataforma única, escalable y fácil de usar.

Sigue la [guía de Railway para desplegar tus proyectos Gin](https://docs.railway.com/guides/gin).

## [Seenode](https://seenode.com)

Seenode es una plataforma en la nube moderna diseñada específicamente para desarrolladores que quieren desplegar aplicaciones rápida y eficientemente. Ofrece despliegue basado en git, certificados SSL automáticos, bases de datos integradas y una interfaz optimizada que pone tus aplicaciones Gin en línea en minutos.

Sigue la [guía de Seenode para desplegar tus proyectos Gin](https://seenode.com/docs/frameworks/go/gin).

## [Koyeb](https://www.koyeb.com)

Koyeb es una plataforma serverless amigable para desarrolladores para desplegar apps globalmente con despliegue basado en git, cifrado TLS, autoescalado nativo, una red edge global y service mesh y descubrimiento integrados.

Sigue la [guía de Koyeb para desplegar tus proyectos Gin](https://www.koyeb.com/tutorials/deploy-go-gin-on-koyeb).

## [Qovery](https://www.qovery.com)

Qovery proporciona hosting gratuito en la nube con bases de datos, SSL, CDN global y despliegues automáticos con Git.

Consulta [Qovery](https://hub.qovery.com/guides/getting-started/deploy-your-first-application/) para más información.

## [Render](https://render.com)

Render es una plataforma en la nube moderna que ofrece soporte nativo para Go, SSL completamente gestionado, bases de datos, despliegues sin tiempo de inactividad, soporte HTTP/2 y websocket.

Sigue la [guía de Render para desplegar proyectos Gin](https://render.com/docs/deploy-go-gin).

## [Google App Engine](https://cloud.google.com/appengine/)

GAE tiene dos formas de desplegar aplicaciones Go. El entorno estándar es más fácil de usar pero menos personalizable y previene [syscalls](https://github.com/gin-gonic/gin/issues/1639) por razones de seguridad. El entorno flexible puede ejecutar cualquier framework o biblioteca.

Aprende más y elige tu entorno preferido en [Go en Google App Engine](https://cloud.google.com/appengine/docs/go/).

## Auto-alojado

Los proyectos Gin también pueden desplegarse de forma auto-alojada. La arquitectura de despliegue y las consideraciones de seguridad varían dependiendo del entorno objetivo. La siguiente sección solo presenta una visión general de alto nivel de las opciones de configuración a considerar al planificar el despliegue.

## Opciones de configuración

Los despliegues de proyectos Gin pueden ajustarse usando variables de entorno o directamente en el código.

Las siguientes variables de entorno están disponibles para configurar Gin:

| Variable de entorno | Descripción                                                                                                                                                                                                   |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PORT                 | El puerto TCP para escuchar al iniciar el servidor Gin con `router.Run()` (es decir, sin argumentos).                                                                                                      |
| GIN_MODE             | Establecer a `debug`, `release` o `test`. Gestiona los modos de Gin, como cuándo emitir salidas de depuración. También puede establecerse en código usando `gin.SetMode(gin.ReleaseMode)` o `gin.SetMode(gin.TestMode)` |

El siguiente código puede usarse para configurar Gin.

```go
// Don't specify the bind address or port for Gin. Defaults to binding on all interfaces on port 8080.
// Can use the `PORT` environment variable to change the listen port when using `Run()` without any arguments.
router := gin.Default()
router.Run()

// Specify the bind address and port for Gin.
router := gin.Default()
router.Run("192.168.1.100:8080")

// Specify only the listen port. Will bind on all interfaces.
router := gin.Default()
router.Run(":8080")

// Set which IP addresses or CIDRs, are considered to be trusted for setting headers to document real client IP addresses.
// See the documentation for additional details.
router := gin.Default()
router.SetTrustedProxies([]string{"192.168.1.2"})
```

Para información sobre la configuración de proxies de confianza, consulta [Proxies de confianza](/es/docs/server-config/trusted-proxies/).
