---
title: "Anunciando Gin 1.11.0: HTTP/3, Melhorias em Formulários, Desempenho e Mais"
linkTitle: "Anúncio do Lançamento do Gin 1.11.0"
lastUpdated: 2025-09-21
---

## Gin v1.11.0 Chegou

Estamos empolgados em anunciar o lançamento do Gin v1.11.0, trazendo um grande conjunto de novos recursos, ajustes de desempenho e correções de bugs para o querido framework web. Este lançamento continua o compromisso do Gin com velocidade, flexibilidade e desenvolvimento moderno em Go.

### Recursos Principais

- **Suporte experimental a HTTP/3:** O Gin agora suporta HTTP/3 experimental via [quic-go](https://github.com/quic-go/quic-go)! Se você está ansioso para experimentar os protocolos de transporte web mais recentes, agora é a sua chance. ([#3210](https://github.com/gin-gonic/gin/pull/3210))

- **Melhorias no Form Binding:** Fizemos grandes melhorias no binding de formulários:
  - Suporte a formatos de coleção de arrays em formulários ([#3986](https://github.com/gin-gonic/gin/pull/3986))
  - Unmarshalling customizado de string slices para tags de formulário ([#3970](https://github.com/gin-gonic/gin/pull/3970))
  - Valores padrão para coleções ([#4048](https://github.com/gin-gonic/gin/pull/4048))

- **Tipos de Binding aprimorados:** Vincule texto puro facilmente com o novo método `BindPlain` ([#3904](https://github.com/gin-gonic/gin/pull/3904)), além de suporte para formatos unixMilli e unixMicro ([#4190](https://github.com/gin-gonic/gin/pull/4190)).

- **Melhorias na API de Contexto:** `GetXxx` agora suporta mais tipos nativos do Go ([#3633](https://github.com/gin-gonic/gin/pull/3633)), facilitando a recuperação de dados do contexto com segurança de tipos.

- **Atualizações de Filesystem:** O novo `OnlyFilesFS` agora é exportado, testado e documentado ([#3939](https://github.com/gin-gonic/gin/pull/3939)).

### Desempenho e Melhorias

- **Tratamento de dados de formulário mais rápido:** Otimizações internas para análise de formulários melhoram o desempenho ([#4339](https://github.com/gin-gonic/gin/pull/4339)).
- Refatoração do core, renderização e lógica de contexto para mais robustez e clareza ([lista completa de PRs no changelog](../releases/release111.md)).

### Correções de Bugs

- **Confiabilidade de Middleware:** Corrigido um bug raro onde o middleware poderia reentrar inesperadamente ([#3987](https://github.com/gin-gonic/gin/pull/3987)).
- Melhorada a estabilidade do binding de formulários TOML ([#4193](https://github.com/gin-gonic/gin/pull/4193)).
- Sem mais panics ao tratar requisições "method not allowed" em árvores vazias ([#4003](https://github.com/gin-gonic/gin/pull/4003)).
- Melhorias gerais no tratamento de contexto, condições de corrida e mais.

### Atualizações de Build, Dependências e CI

- Suporte para **Go 1.25** nos workflows de CI/CD, além de novos linters habilitados para uma saúde de código mais rigorosa ([#4341](https://github.com/gin-gonic/gin/pull/4341), [#4010](https://github.com/gin-gonic/gin/pull/4010)).
- Verificação de vulnerabilidades com Trivy agora integrada ao CI ([#4359](https://github.com/gin-gonic/gin/pull/4359)).
- Múltiplas atualizações de dependências, incluindo `sonic`, `setup-go`, `quic-go` e outros.

### Documentação

- Documentação expandida, changelogs atualizados, gramática e exemplos de código melhorados, e nova documentação em português ([#4078](https://github.com/gin-gonic/gin/pull/4078)).

---

O Gin 1.11.0 é um testemunho da nossa comunidade ativa e desenvolvimento contínuo. Agradecemos a cada contribuidor, relator de issues e usuário que mantém o Gin afiado e relevante para aplicações web modernas.

Pronto para experimentar o Gin 1.11.0? [Atualize no GitHub](https://github.com/gin-gonic/gin/releases/tag/v1.11.0) e diga-nos o que você acha!
