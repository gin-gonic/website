---
title: "Compilar con reemplazo de JSON"
sidebar:
  order: 1
---

Gin usa el paquete de la biblioteca estándar `encoding/json` para la serialización y deserialización JSON por defecto. El codificador de la biblioteca estándar está bien probado y es completamente compatible, pero no es la opción más rápida disponible. Si el rendimiento de JSON es un cuello de botella en tu aplicación -- por ejemplo, en APIs de alto rendimiento que serializan payloads de respuesta grandes -- puedes intercambiarlo por un reemplazo directo más rápido en tiempo de compilación usando etiquetas de compilación. No se requieren cambios de código.

## Reemplazos disponibles

Gin soporta tres codificadores JSON alternativos. Cada uno implementa la misma interfaz que Gin espera, por lo que tus handlers, middleware y lógica de enlace continúan funcionando sin modificación.

### go-json

[go-json](https://github.com/goccy/go-json) es un codificador JSON puro en Go que ofrece mejoras significativas de rendimiento sobre `encoding/json` mientras mantiene compatibilidad completa. Funciona en todas las plataformas y arquitecturas.

```sh
go build -tags=go_json .
```

### jsoniter

[jsoniter](https://github.com/json-iterator/go) (json-iterator) es otra biblioteca JSON de alto rendimiento pura en Go. Es compatible con la API de `encoding/json` y proporciona un sistema de configuración flexible para casos de uso avanzados.

```sh
go build -tags=jsoniter .
```

### sonic

[sonic](https://github.com/bytedance/sonic) es un codificador JSON extremadamente rápido desarrollado por ByteDance. Usa compilación JIT e instrucciones SIMD para lograr el máximo rendimiento, convirtiéndolo en la opción más rápida entre las tres.

```sh
go build -tags="sonic avx" .
```

:::note
Sonic requiere una CPU con soporte de instrucciones AVX. Esto está disponible en la mayoría de los procesadores x86_64 modernos (Intel Sandy Bridge y posteriores, AMD Bulldozer y posteriores), pero no funcionará en arquitecturas ARM o hardware x86 más antiguo. Si tu objetivo de despliegue no soporta AVX, usa go-json o jsoniter en su lugar.
:::

## Elegir un reemplazo

| Codificador | Soporte de plataforma | Fortaleza clave |
|---|---|---|
| `encoding/json` (predeterminado) | Todos | Máxima compatibilidad, sin dependencia extra |
| go-json | Todos | Buena mejora de velocidad, puro Go, amplia compatibilidad |
| jsoniter | Todos | Buena mejora de velocidad, configuración flexible |
| sonic | Solo x86_64 con AVX | Mayor rendimiento vía JIT y SIMD |

Para la mayoría de las aplicaciones, **go-json** es una opción segura y efectiva -- funciona en todas partes y proporciona ganancias de rendimiento significativas. Elige **sonic** cuando necesites el máximo rendimiento de JSON y tus servidores ejecuten hardware x86_64. Elige **jsoniter** si necesitas sus características específicas de configuración o ya lo estás usando en otro lugar de tu código.

## Verificar el reemplazo

Puedes confirmar que el reemplazo está activo comparando el rendimiento de serialización con un benchmark simple, o verificando la tabla de símbolos del binario:

```sh
# Build with go-json
go build -tags=go_json -o myapp .

# Check that go-json symbols are present
go tool nm myapp | grep goccy
```

La etiqueta de compilación también funciona con otros comandos de Go:

```sh
go run -tags=go_json .
go test -tags=go_json ./...
```

:::note
Solo usa una etiqueta de reemplazo JSON a la vez. Si especificas múltiples etiquetas JSON (ej. `-tags=go_json,jsoniter`), el comportamiento es indefinido. La etiqueta `nomsgpack` puede combinarse de forma segura con cualquier etiqueta de reemplazo JSON.
:::
