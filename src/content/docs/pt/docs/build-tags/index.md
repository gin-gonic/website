---
title: "Tags de Build"
sidebar:
  order: 11
---

As [tags de build](https://pkg.go.dev/go/build#hdr-Build_Constraints) do Go (também chamadas de restrições de build) são diretivas que dizem ao compilador Go para incluir ou excluir arquivos durante a compilação. O Gin usa tags de build para permitir trocar implementações internas ou desabilitar recursos opcionais em tempo de compilação, sem alterar nenhum código da aplicação.

Isso é útil em vários cenários:

- **Otimização de desempenho** -- Substitua o pacote `encoding/json` padrão por um encoder de terceiros mais rápido para acelerar a serialização JSON na sua API.
- **Redução do tamanho do binário** -- Remova recursos que você não usa, como renderização MsgPack, para produzir um binário compilado menor.
- **Ajuste de implantação** -- Escolha encoders diferentes para ambientes diferentes (ex.: um build de produção de alta vazão vs. um build de desenvolvimento padrão).

Tags de build são passadas ao toolchain do Go com a flag `-tags`:

```sh
go build -tags=<tag_name> .
```

Você pode combinar múltiplas tags separando-as com vírgulas:

```sh
go build -tags=nomsgpack,go_json .
```

### Tags de build disponíveis

| Tag | Effect |
|---|---|
| `go_json` | Replaces `encoding/json` with [go-json](https://github.com/goccy/go-json) |
| `jsoniter` | Replaces `encoding/json` with [jsoniter](https://github.com/json-iterator/go) |
| `sonic avx` | Replaces `encoding/json` with [sonic](https://github.com/bytedance/sonic) (requires AVX CPU instructions) |
| `nomsgpack` | Disables MsgPack rendering support |

:::note
Tags de build afetam apenas como o Gin é compilado. O código da sua aplicação (handlers de rota, middleware, etc.) não precisa mudar quando você troca as tags.
:::

## Nesta seção

As páginas abaixo cobrem cada tag de build em detalhes:

- [**Build com substituição de JSON**](./json-replacement/) -- Substitua o encoder JSON padrão por go-json, jsoniter ou sonic para serialização mais rápida.
- [**Build sem MsgPack**](./nomsgpack/) -- Desabilite a renderização MsgPack com a tag de build `nomsgpack` para reduzir o tamanho do binário.
