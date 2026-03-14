---
title: "Anunciando Gin 1.12.0: Suporte BSON, Melhorias de Contexto, Desempenho e Mais"
linkTitle: "Anúncio do Lançamento do Gin 1.12.0"
lastUpdated: 2026-02-28
---

## Gin v1.12.0 Chegou

Estamos entusiasmados em anunciar o lançamento do Gin v1.12.0, repleto de novos recursos, melhorias significativas de desempenho e uma sólida rodada de correções de bugs. Este lançamento aprofunda o suporte do Gin a protocolos modernos, refina a experiência do desenvolvedor e continua a tradição do projeto de ser rápido e leve.

### Recursos Principais

- **Suporte ao protocolo BSON:** A camada de renderização agora suporta codificação BSON, abrindo portas para troca de dados binários mais eficiente ([#4145](https://github.com/gin-gonic/gin/pull/4145)).

- **Novos métodos de contexto:** Dois novos helpers tornam o tratamento de erros mais limpo e idiomático:
  - `GetError` e `GetErrorSlice` para recuperação de erros com segurança de tipos a partir do contexto ([#4502](https://github.com/gin-gonic/gin/pull/4502))
  - Método `Delete` para remover chaves do contexto ([#38e7651](https://github.com/gin-gonic/gin/commit/38e7651))

- **Binding flexível:** O binding de URI e query agora respeita `encoding.UnmarshalText`, dando mais controle sobre a deserialização de tipos customizados ([#4203](https://github.com/gin-gonic/gin/pull/4203)).

- **Opção de caminho escapado:** Uma nova opção do engine permite optar por usar o caminho da requisição escapado (raw) para roteamento ([#4420](https://github.com/gin-gonic/gin/pull/4420)).

- **Protocol Buffers na negociação de conteúdo:** O `context` agora suporta Protocol Buffers como um tipo de conteúdo negociável, facilitando a integração de respostas no estilo gRPC ([#4423](https://github.com/gin-gonic/gin/pull/4423)).

- **Latência colorizada no Logger:** O logger padrão agora renderiza a latência com cores, facilitando identificar requisições lentas rapidamente ([#4146](https://github.com/gin-gonic/gin/pull/4146)).

### Desempenho e Melhorias

- **Otimizações na árvore do roteador:** Múltiplas melhorias na árvore radix reduzem alocações e aceleram a análise de caminhos:
  - Menos alocações em `findCaseInsensitivePath` ([#4417](https://github.com/gin-gonic/gin/pull/4417))
  - Análise de caminho usando `strings.Count` para eficiência ([#4246](https://github.com/gin-gonic/gin/pull/4246))
  - Regex substituído por funções customizadas em `redirectTrailingSlash` ([#4414](https://github.com/gin-gonic/gin/pull/4414))
- **Otimização de Recovery:** A leitura de stack trace agora é mais eficiente ([#4466](https://github.com/gin-gonic/gin/pull/4466)).
- **Melhorias no Logger:** A saída de query string agora pode ser omitida via configuração ([#4547](https://github.com/gin-gonic/gin/pull/4547)).
- **Confiança em Unix Socket:** Headers `X-Forwarded-For` agora são sempre confiáveis quando requisições chegam por Unix socket ([#3359](https://github.com/gin-gonic/gin/pull/3359)).
- **Segurança do Flush:** `Flush()` não causa mais panic quando o `http.ResponseWriter` subjacente não implementa `http.Flusher` ([#4479](https://github.com/gin-gonic/gin/pull/4479)).
- **Refatorações de qualidade de código:** Tratamento mais limpo de maps com `maps.Copy` e `maps.Clone`, constantes nomeadas substituindo números mágicos, loops range-over-int modernizados e mais ([#4352](https://github.com/gin-gonic/gin/pull/4352), [#4333](https://github.com/gin-gonic/gin/pull/4333), [#4529](https://github.com/gin-gonic/gin/pull/4529), [#4392](https://github.com/gin-gonic/gin/pull/4392)).

### Correções de Bugs

- **Panic no roteador corrigido:** Resolvido um panic em `findCaseInsensitivePathRec` quando `RedirectFixedPath` está habilitado ([#4535](https://github.com/gin-gonic/gin/pull/4535)).
- **Content-Length no Data Render:** `Data.Render` agora escreve corretamente o header `Content-Length` ([#4206](https://github.com/gin-gonic/gin/pull/4206)).
- **ClientIP com múltiplos headers:** `ClientIP` agora trata corretamente requisições com múltiplos valores de header `X-Forwarded-For` ([#4472](https://github.com/gin-gonic/gin/pull/4472)).
- **Casos extremos de binding:** Corrigidos erros de valores vazios no binding ([#2169](https://github.com/gin-gonic/gin/pull/2169)) e melhorado o tratamento de slices/arrays vazios no binding de formulários ([#4380](https://github.com/gin-gonic/gin/pull/4380)).
- **Rotas com dois-pontos literais:** Rotas com dois-pontos literais agora funcionam corretamente com `engine.Handler()` ([#4415](https://github.com/gin-gonic/gin/pull/4415)).
- **Vazamento de file descriptor:** `RunFd` agora fecha o handle `os.File` corretamente para prevenir vazamento de recursos ([#4422](https://github.com/gin-gonic/gin/pull/4422)).
- **Comportamento de Hijack:** Refinado o comportamento de hijack para modelar corretamente o ciclo de vida da resposta ([#4373](https://github.com/gin-gonic/gin/pull/4373)).
- **Recovery:** `http.ErrAbortHandler` agora é suprimido no middleware de recovery conforme planejado ([#4336](https://github.com/gin-gonic/gin/pull/4336)).
- **Versão incorreta em debug:** Corrigida uma string de versão incorreta reportada no modo debug ([#4403](https://github.com/gin-gonic/gin/pull/4403)).

### Atualizações de Build, Dependências e CI

- **Go 1.25 mínimo:** A versão mínima suportada do Go agora é **1.25**, com workflows de CI atualizados adequadamente ([#4550](https://github.com/gin-gonic/gin/pull/4550)).
- **Atualização da dependência BSON:** A dependência de binding BSON foi atualizada para `mongo-driver` v2 ([#4549](https://github.com/gin-gonic/gin/pull/4549)).

---

O Gin 1.12.0 reflete a dedicação da nossa comunidade -- contribuidores, revisores e usuários. Obrigado por tornar o Gin melhor a cada lançamento.

Pronto para experimentar o Gin 1.12.0? [Atualize no GitHub](https://github.com/gin-gonic/gin/releases/tag/v1.12.0) e diga-nos o que você acha!
