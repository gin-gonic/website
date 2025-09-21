---
title: "Gin 1.11.0 lançado! HTTP/3, melhorias em formulários, performance e mais"
linkTitle: "Anúncio do Gin 1.11.0"
lastUpdated: 2025-09-21
---

## Chegou o Gin v1.11.0

Estamos animados em anunciar o lançamento do Gin v1.11.0, trazendo uma série de novidades, ajustes de performance e correções para o framework web querido da comunidade Go. Este lançamento reforça o compromisso do Gin com velocidade, flexibilidade e modernidade no desenvolvimento Go.

### 🌟 Principais novidades

- **Suporte experimental ao HTTP/3:** Agora, o Gin suporta HTTP/3 experimentalmente via [quic-go](https://github.com/quic-go/quic-go)! Se você quer testar os protocolos web mais modernos, esta é a sua chance. ([#3210](https://github.com/gin-gonic/gin/pull/3210))

- **Melhorias no binding de formulário:**
  - Suporte a coleções do tipo array para formulários ([#3986](https://github.com/gin-gonic/gin/pull/3986))
  - Unmarshal customizado de slices de string para tags de formulário ([#3970](https://github.com/gin-gonic/gin/pull/3970))
  - Valores padrão para coleções ([#4048](https://github.com/gin-gonic/gin/pull/4048))

- **Binding de tipos aprimorado:** Novo método `BindPlain` para texto puro ([#3904](https://github.com/gin-gonic/gin/pull/3904)), além de suporte aos formatos unixMilli e unixMicro ([#4190](https://github.com/gin-gonic/gin/pull/4190)).

- **Aprimoramento da API de Contexto:** O `GetXxx` agora suporta mais tipos nativos do Go ([#3633](https://github.com/gin-gonic/gin/pull/3633)), facilitando o acesso seguro aos dados do contexto.

- **Sistema de arquivos:** Novo `OnlyFilesFS` agora está exportado, testado e documentado ([#3939](https://github.com/gin-gonic/gin/pull/3939)).

### 🚀 Performance e aprimoramentos

- **Formulários ainda mais rápidos:** Otimizações internas no parsing de formulário aumentam a performance ([#4339](https://github.com/gin-gonic/gin/pull/4339)).
- Refatorações no núcleo, renderização e lógica de contexto aumentando a robustez ([lista completa de PRs no changelog](../releases/release111.md)).

### 🐛 Correções de bugs

- **Middleware mais confiável:** Corrigido bug raro de reentrada indevida ([#3987](https://github.com/gin-gonic/gin/pull/3987)).
- Mais estabilidade no binding de formulário TOML ([#4193](https://github.com/gin-gonic/gin/pull/4193)).
- Não há mais panics ao tratar "method not allowed" em árvores vazias ([#4003](https://github.com/gin-gonic/gin/pull/4003)).
- Melhorias gerais em contexto, condições de corrida e outros detalhes.

### 🔧 Build, dependências e CI

- **Go 1.25** suportado nos fluxos de trabalho CI/CD, além de novos linters para garantir qualidade ([#4341](https://github.com/gin-gonic/gin/pull/4341), [#4010](https://github.com/gin-gonic/gin/pull/4010)).
- Escaneamento de vulnerabilidades Trivy integrado ao CI ([#4359](https://github.com/gin-gonic/gin/pull/4359)).
- Diversos upgrades de dependências: sonic, setup-go, quic-go, etc.

### 📖 Documentação

- Documentação expandida, changelogs atualizados, melhorias em exemplos/gramática, e agora com versão em português ([#4078](https://github.com/gin-gonic/gin/pull/4078)).

---

Gin 1.11.0 é resultado do trabalho constante e da energia da comunidade. Obrigado a todos os contribuidores, quem relata bugs e aos usuários que mantém o Gin relevante e moderno para aplicações web.

Pronto para testar o Gin 1.11.0? [Atualize pelo GitHub](https://github.com/gin-gonic/gin/releases/tag/v1.11.0) e compartilhe seu feedback!
