---
title: "Build com substituição de JSON"
sidebar:
  order: 1
---

O Gin usa o pacote `encoding/json` da biblioteca padrão para serialização e deserialização JSON por padrão. O encoder da biblioteca padrão é bem testado e totalmente compatível, mas não é a opção mais rápida disponível. Se o desempenho de JSON é um gargalo na sua aplicação -- por exemplo, em APIs de alta vazão que serializam grandes payloads de resposta -- você pode substituí-lo por uma alternativa mais rápida em tempo de build usando tags de build. Nenhuma alteração de código é necessária.

## Substituições disponíveis

O Gin suporta três encoders JSON alternativos. Cada um implementa a mesma interface que o Gin espera, então seus handlers, middleware e lógica de binding continuam funcionando sem modificação.

### go-json

[go-json](https://github.com/goccy/go-json) is a pure-Go JSON encoder that offers significant performance improvements over `encoding/json` while maintaining full compatibility. It works on all platforms and architectures.

```sh
go build -tags=go_json .
```

### jsoniter

[jsoniter](https://github.com/json-iterator/go) (json-iterator) is another pure-Go, high-performance JSON library. It is API-compatible with `encoding/json` and provides a flexible configuration system for advanced use cases.

```sh
go build -tags=jsoniter .
```

### sonic

[sonic](https://github.com/bytedance/sonic) is a blazing-fast JSON encoder developed by ByteDance. It uses JIT compilation and SIMD instructions to achieve maximum throughput, making it the fastest option among the three.

```sh
go build -tags="sonic avx" .
```

:::note
Sonic requires a CPU with AVX instruction support. This is available on most modern x86_64 processors (Intel Sandy Bridge and later, AMD Bulldozer and later), but it will not work on ARM architectures or older x86 hardware. If your deployment target does not support AVX, use go-json or jsoniter instead.
:::

## Escolhendo uma substituição

| Encoder | Platform support | Key strength |
|---|---|---|
| `encoding/json` (default) | All | Maximum compatibility, no extra dependency |
| go-json | All | Good speedup, pure Go, broad compatibility |
| jsoniter | All | Good speedup, flexible configuration |
| sonic | x86_64 with AVX only | Highest throughput via JIT and SIMD |

Para a maioria das aplicações, **go-json** é uma escolha segura e eficaz -- funciona em todos os lugares e fornece ganhos de desempenho significativos. Escolha **sonic** quando precisar de vazão máxima de JSON e seus servidores rodarem em hardware x86_64. Escolha **jsoniter** se precisar de seus recursos específicos de configuração ou já estiver usando-o em outro lugar no seu código.

## Verificando a substituição

Você pode confirmar que a substituição está ativa comparando o desempenho de serialização com um benchmark simples, ou verificando a tabela de símbolos do binário:

```sh
# Build with go-json
go build -tags=go_json -o myapp .

# Check that go-json symbols are present
go tool nm myapp | grep goccy
```

A tag de build também funciona com outros comandos Go:

```sh
go run -tags=go_json .
go test -tags=go_json ./...
```

:::note
Use apenas uma tag de substituição JSON por vez. Se você especificar múltiplas tags JSON (ex.: `-tags=go_json,jsoniter`), o comportamento é indefinido. A tag `nomsgpack` pode ser combinada com segurança com qualquer tag de substituição JSON.
:::
