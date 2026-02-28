---
title: "Anunciando Gin 1.12.0: Suporte BSON, Melhorias de Context, Desempenho e Mais"
linkTitle: "Anúncio de Lançamento do Gin 1.12.0"
lastUpdated: 2026-02-28
---

## Gin v1.12.0 Chegou

Temos o prazer de anunciar o lançamento do Gin v1.12.0, repleto de novos recursos, melhorias significativas de desempenho e uma rodada sólida de correções de bugs. Este lançamento aprofunda o suporte do Gin para protocolos modernos, refina a experiência do desenvolvedor e continua a tradição do projeto de permanecer rápido e leve.

### 🌟 Principais Características

- **Suporte ao Protocolo BSON:** A camada de renderização agora suporta codificação BSON, abrindo a porta para troca de dados binários mais eficiente (#4145).

- **Novos Métodos de Context:** Dois novos auxiliares tornam o tratamento de erros mais limpo e idiomático:
  - `GetError` e `GetErrorSlice` para recuperação de erros com segurança de tipo do contexto (#4502)
  - Método `Delete` para remover chaves do contexto (#38e7651)

- **Vinculação Flexível:** Vinculação de URI e consulta agora honram `encoding.UnmarshalText`, dando-lhe mais controle sobre desserialização de tipos personalizados (#4203).

- **Opção de Caminho Escapado:** Uma nova opção de mecanismo permite que você opte por usar o caminho de solicitação escapado (bruto) para roteamento (#4420).

- **Buffers de Protocolo na Negociação de Conteúdo:** `context` agora suporta Buffers de Protocolo como um tipo de conteúdo negociável, facilitando a integração de respostas de estilo gRPC (#4423).

- **Latência Colorida no Logger:** O logger padrão agora renderiza a latência com cor, facilitando a identificação de solicitações lentas à primeira vista (#4146).

### 🚀 Desempenho e Melhorias

- **Otimizações da Árvore de Roteamento:** Múltiplas melhorias na árvore radix reduzem alocações e aceleram a análise de caminho:
  - Menos alocações em `findCaseInsensitivePath` (#4417)
  - Análise de caminho usando `strings.Count` para eficiência (#4246)
  - Regex substituído por funções personalizadas em `redirectTrailingSlash` (#4414)
- **Otimização de Recuperação:** A leitura de rastreamento de pilha agora é mais eficiente (#4466).
- **Melhorias do Logger:** A saída de string de consulta agora pode ser ignorada via configuração (#4547).
- **Confiança de Socket Unix:** Os cabeçalhos `X-Forwarded-For` agora são sempre confiáveis quando as solicitações chegam por um socket Unix (#3359).
- **Segurança de Flush:** `Flush()` não entra mais em pânico quando o `http.ResponseWriter` subjacente não implementa `http.Flusher` (#4479).
- **Refatorações de Qualidade de Código:** Manipulação de mapa mais limpa com `maps.Copy` e `maps.Clone`, constantes nomeadas substituindo números mágicos, loops range-over-int modernizados e muito mais (#4352, #4333, #4529, #4392).

### 🐛 Correções de Bugs

- **Pânico do Roteador Corrigido:** Resolvido um pânico em `findCaseInsensitivePathRec` quando `RedirectFixedPath` está habilitado (#4535).
- **Content-Length em Renderização de Dados:** `Data.Render` agora escreve corretamente o cabeçalho `Content-Length` (#4206).
- **ClientIP com Múltiplos Cabeçalhos:** `ClientIP` agora manipula corretamente solicitações com múltiplos valores de cabeçalho `X-Forwarded-For` (#4472).
- **Casos Extremos de Vinculação:** Corrigidos erros de valor vazio em vinculação (#2169) e melhorada a manipulação de arrays/slices vazios em vinculação de formulário (#4380).
- **Rotas com Dois-pontos Literais:** Rotas com dois-pontos literais agora funcionam corretamente com `engine.Handler()` (#4415).
- **Vazamento de Descritor de Arquivo:** `RunFd` agora fecha adequadamente o identificador `os.File` para evitar vazamentos de recursos (#4422).
- **Comportamento de Hijack:** Refinado o comportamento de hijack para modelar corretamente o ciclo de vida da resposta (#4373).
- **Recuperação:** `http.ErrAbortHandler` agora é suprimido no middleware de recuperação conforme pretendido (#4336).
- **Versão de Debug Não Correspondente:** Corrigida uma string de versão incorreta reportada no modo de depuração (#4403).

### 🔧 Compilação, Dependência e Atualizações de CI

- **Mínimo de Go 1.25:** A versão mínima suportada do Go é agora **1.25**, com fluxos de trabalho de CI atualizados de acordo (#4550).
- **Atualização de Dependência BSON:** A dependência de vinculação BSON foi atualizada para `mongo-driver` v2 (#4549).

---

Gin 1.12.0 reflete a dedicação de nossa comunidade — contribuidores, revisores e usuários. Obrigado por tornar o Gin melhor a cada lançamento.

Pronto para experimentar o Gin 1.12.0? Atualize no GitHub e nos diga o que você acha!
