---
title: "Build com substituição de JSON"
sidebar:
  order: 1
---

O Gin usa o pacote `encoding/json` da biblioteca padrão para serialização e deserialização JSON por padrão. O encoder da biblioteca padrão é bem testado e totalmente compatível, mas não é a opção mais rápida disponível. Se o desempenho de JSON é um gargalo na sua aplicação -- por exemplo, em APIs de alta vazão que serializam grandes payloads de resposta -- você pode substituí-lo por uma alternativa mais rápida em tempo de build usando tags de build. Nenhuma alteração de código é necessária.

## Substituições disponíveis

O Gin suporta três encoders JSON alternativos. Cada um implementa a mesma interface que o Gin espera, então seus handlers, middleware e lógica de binding continuam funcionando sem modificação.

### go-json

[go-json](https://github.com/goccy/go-json) é um encoder JSON puro em Go que oferece melhorias significativas de desempenho em relação ao `encoding/json` mantendo total compatibilidade. Funciona em todas as plataformas e arquiteturas.

```sh
go build -tags=go_json .
```

### jsoniter

[jsoniter](https://github.com/json-iterator/go) (json-iterator) é outra biblioteca JSON pura em Go de alto desempenho. É compatível com a API do `encoding/json` e fornece um sistema de configuração flexível para casos de uso avançados.

```sh
go build -tags=jsoniter .
```

### sonic

[sonic](https://github.com/bytedance/sonic) é um encoder JSON extremamente rápido desenvolvido pela ByteDance. Utiliza compilação JIT e instruções SIMD para alcançar o máximo de vazão, tornando-o a opção mais rápida entre as três.

```sh
go build -tags="sonic avx" .
```

:::note
O Sonic requer uma CPU com suporte a instruções AVX. Isso está disponível na maioria dos processadores x86_64 modernos (Intel Sandy Bridge e posteriores, AMD Bulldozer e posteriores), mas não funcionará em arquiteturas ARM ou hardware x86 mais antigo. Se seu alvo de implantação não suporta AVX, use go-json ou jsoniter em vez disso.
:::

## Escolhendo uma substituição

| Encoder | Suporte a plataformas | Ponto forte |
|---|---|---|
| `encoding/json` (padrão) | Todas | Máxima compatibilidade, sem dependência extra |
| go-json | Todas | Boa aceleração, puro Go, ampla compatibilidade |
| jsoniter | Todas | Boa aceleração, configuração flexível |
| sonic | Apenas x86_64 com AVX | Maior vazão via JIT e SIMD |

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
Use apenas uma tag de substituição de JSON por vez. Se você especificar múltiplas tags JSON (ex.: `-tags=go_json,jsoniter`), o comportamento é indefinido. A tag `nomsgpack` pode ser combinada com segurança com qualquer tag de substituição de JSON.
:::
