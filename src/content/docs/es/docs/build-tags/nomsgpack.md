---
title: "Compilar sin MsgPack"
sidebar:
  order: 2
---

[MsgPack](https://msgpack.org/) (MessagePack) es un formato de serialización binario compacto -- piensa en él como una alternativa más rápida y más pequeña a JSON. Gin incluye soporte de renderizado y enlace de MsgPack por defecto, lo que significa que tu aplicación puede aceptar y devolver datos codificados en MsgPack sin configuración adicional usando `c.Bind()` y `c.Render()` con el tipo de contenido apropiado.

Sin embargo, muchas aplicaciones solo usan JSON y nunca necesitan MsgPack. En ese caso, la dependencia de MsgPack agrega peso innecesario a tu binario compilado. Puedes eliminarlo con la etiqueta de compilación `nomsgpack`.

## Compilar sin MsgPack

Pasa la etiqueta `nomsgpack` a `go build`:

```sh
go build -tags=nomsgpack .
```

Esto también funciona con otros comandos de Go:

```sh
go run -tags=nomsgpack .
go test -tags=nomsgpack ./...
```

## Qué cambia

Cuando compilas con `nomsgpack`, Gin excluye el código de renderizado y enlace de MsgPack en tiempo de compilación. Esto tiene algunos efectos prácticos:

- El binario compilado es más pequeño porque la biblioteca de serialización MsgPack no se enlaza.
- Cualquier handler que intente renderizar o enlazar datos MsgPack ya no funcionará. Si usas `c.ProtoBuf()` u otros renderizadores que no son MsgPack, esos no se ven afectados.
- Todas las características de JSON, XML, YAML, TOML y ProtoBuf continúan funcionando normalmente.

:::note
Si tu API no sirve respuestas MsgPack y no llamas a `c.MsgPack()` en ningún lugar, es seguro usar esta etiqueta. Tus handlers existentes de JSON y HTML se comportarán de manera idéntica.
:::

## Verificar el resultado

Puedes confirmar la reducción de tamaño del binario comparando compilaciones:

```sh
# Standard build
go build -o gin-app .
ls -lh gin-app

# Build without MsgPack
go build -tags=nomsgpack -o gin-app-nomsgpack .
ls -lh gin-app-nomsgpack
```

Los ahorros exactos dependen de tu aplicación, pero eliminar MsgPack típicamente reduce un poco el binario final. Para más información, consulta el [pull request original](https://github.com/gin-gonic/gin/pull/1852).
