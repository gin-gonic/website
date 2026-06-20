---
title: "Build sem MsgPack"
sidebar:
  order: 2
---

[MsgPack](https://msgpack.org/) (MessagePack) é um formato de serialização binário compacto -- pense nele como uma alternativa mais rápida e menor ao JSON. O Gin inclui suporte a renderização e binding MsgPack por padrão, o que significa que sua aplicação pode aceitar e retornar dados codificados em MsgPack prontos para uso com `c.Bind()` e `c.Render()` com o content type apropriado.

No entanto, muitas aplicações usam apenas JSON e nunca precisam de MsgPack. Nesse caso, a dependência do MsgPack adiciona peso desnecessário ao seu binário compilado. Você pode removê-la com a tag de build `nomsgpack`.

## Construindo sem MsgPack

Passe a tag `nomsgpack` para `go build`:

```sh
go build -tags=nomsgpack .
```

Isso também funciona com outros comandos Go:

```sh
go run -tags=nomsgpack .
go test -tags=nomsgpack ./...
```

## O que muda

Quando você compila com `nomsgpack`, o Gin exclui o código de renderização e binding MsgPack em tempo de compilação. Isso tem alguns efeitos práticos:

- O binário compilado é menor porque a biblioteca de serialização MsgPack não é vinculada.
- Qualquer handler que tente renderizar ou vincular dados MsgPack não funcionará mais. Se você usa `c.ProtoBuf()` ou outros renderers que não são MsgPack, eles não são afetados.
- Todos os recursos de JSON, XML, YAML, TOML e ProtoBuf continuam funcionando normalmente.

:::note
Se sua API não serve respostas MsgPack e você não chama `c.MsgPack()` em nenhum lugar, é seguro usar esta tag. Seus handlers JSON e HTML existentes se comportarão de forma idêntica.
:::

## Verificando o resultado

Você pode confirmar a redução do tamanho do binário comparando builds:

```sh
# Standard build
go build -o gin-app .
ls -lh gin-app

# Build without MsgPack
go build -tags=nomsgpack -o gin-app-nomsgpack .
ls -lh gin-app-nomsgpack
```

A economia exata depende da sua aplicação, mas remover o MsgPack tipicamente reduz um pouco o binário final. Para mais contexto, veja o [pull request original](https://github.com/gin-gonic/gin/pull/1852).
