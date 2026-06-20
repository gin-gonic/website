---
title: "Evitar registrar cadenas de consulta"
sidebar:
  order: 5
---

Las cadenas de consulta frecuentemente contienen información sensible como tokens de API, contraseñas, IDs de sesión o información de identificación personal (PII). Registrar estos valores puede crear riesgos de seguridad y puede violar regulaciones de privacidad como GDPR o HIPAA. Al eliminar las cadenas de consulta de tus logs, reduces la posibilidad de filtrar datos sensibles a través de archivos de log, sistemas de monitoreo o herramientas de reporte de errores.

Usa la opción `SkipQueryString` en `LoggerConfig` para evitar que las cadenas de consulta aparezcan en los logs. Cuando está habilitada, una solicitud a `/path?token=secret&user=alice` se registrará simplemente como `/path`.

```go
func main() {
  router := gin.New()

  // SkipQueryString indicates that the logger should not log the query string.
  // For example, /path?q=1 will be logged as /path
  loggerConfig := gin.LoggerConfig{SkipQueryString: true}

  router.Use(gin.LoggerWithConfig(loggerConfig))
  router.Use(gin.Recovery())

  router.GET("/search", func(c *gin.Context) {
    q := c.Query("q")
    c.String(200, "searching for: "+q)
  })

  router.Run(":8080")
}
```

Puedes probar la diferencia con `curl`:

```bash
curl "http://localhost:8080/search?q=gin&token=secret123"
```

Sin `SkipQueryString`, la entrada de log incluye la cadena de consulta completa:

```
[GIN] 2025/06/01 - 15:04:05 | 200 |     102.4µs |       127.0.0.1 | GET      "/search?q=gin&token=secret123"
```

Con `SkipQueryString: true`, la cadena de consulta se elimina:

```
[GIN] 2025/06/01 - 15:04:05 | 200 |     102.4µs |       127.0.0.1 | GET      "/search"
```

Esto es particularmente útil en entornos sensibles al cumplimiento donde la salida de logs se reenvía a servicios de terceros o se almacena a largo plazo. Tu aplicación todavía tiene acceso completo a los parámetros de consulta a través de `c.Query()` -- solo la salida de logs se ve afectada.
