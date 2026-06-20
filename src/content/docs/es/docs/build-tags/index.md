---
title: "Etiquetas de compilación"
sidebar:
  order: 11
---

Las [etiquetas de compilación](https://pkg.go.dev/go/build#hdr-Build_Constraints) de Go (también llamadas restricciones de compilación) son directivas que le indican al compilador de Go incluir o excluir archivos durante la compilación. Gin usa etiquetas de compilación para permitirte intercambiar implementaciones internas o deshabilitar características opcionales en tiempo de compilación, sin cambiar ningún código de aplicación.

Esto es útil en varios escenarios:

- **Optimización de rendimiento** -- Reemplazar el paquete `encoding/json` predeterminado con un codificador de terceros más rápido para acelerar la serialización JSON en tu API.
- **Reducción del tamaño del binario** -- Eliminar características que no usas, como el renderizado MsgPack, para producir un binario compilado más pequeño.
- **Ajuste de despliegue** -- Elegir diferentes codificadores para diferentes entornos (ej. una compilación de producción de alto rendimiento vs. una compilación de desarrollo estándar).

Las etiquetas de compilación se pasan a la cadena de herramientas de Go con la bandera `-tags`:

```sh
go build -tags=<tag_name> .
```

Puedes combinar múltiples etiquetas separándolas con comas:

```sh
go build -tags=nomsgpack,go_json .
```

### Etiquetas de compilación disponibles

| Etiqueta | Efecto |
|---|---|
| `go_json` | Reemplaza `encoding/json` con [go-json](https://github.com/goccy/go-json) |
| `jsoniter` | Reemplaza `encoding/json` con [jsoniter](https://github.com/json-iterator/go) |
| `sonic avx` | Reemplaza `encoding/json` con [sonic](https://github.com/bytedance/sonic) (requiere instrucciones de CPU AVX) |
| `nomsgpack` | Deshabilita el soporte de renderizado MsgPack |

:::note
Las etiquetas de compilación solo afectan cómo se compila Gin. Tu código de aplicación (handlers de rutas, middleware, etc.) no necesita cambiar cuando cambias las etiquetas.
:::

## En esta sección

Las páginas a continuación cubren cada etiqueta de compilación en detalle:

- [**Compilar con reemplazo de JSON**](./json-replacement/) -- Reemplazar el codificador JSON predeterminado con go-json, jsoniter o sonic para una serialización más rápida.
- [**Compilar sin MsgPack**](./nomsgpack/) -- Deshabilitar el renderizado MsgPack con la etiqueta de compilación `nomsgpack` para reducir el tamaño del binario.
