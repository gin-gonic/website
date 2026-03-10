---
title: "Gin 1.12.0 foi lançado"
linkTitle: "Gin 1.12.0 foi lançado"
lastUpdated: 2026-02-28
---

## Gin v1.12.0

### Recursos

* feat(binding): adicionar suporte para encoding.UnmarshalText em binding uri/query ([#4203](https://github.com/gin-gonic/gin/pull/4203))
* feat(context): adicionar métodos GetError e GetErrorSlice para recuperação de erros ([#4502](https://github.com/gin-gonic/gin/pull/4502))
* feat(context): adicionar suporte de Protocol Buffers à negociação de conteúdo ([#4423](https://github.com/gin-gonic/gin/pull/4423))
* feat(context): implementado método Delete ([#4296](https://github.com/gin-gonic/gin/pull/4296))
* feat(gin): adicionar opção para usar caminho escapado ([#4420](https://github.com/gin-gonic/gin/pull/4420))
* feat(logger): latência colorida ([#4146](https://github.com/gin-gonic/gin/pull/4146))
* feat(render): adicionar protocolo bson ([#4145](https://github.com/gin-gonic/gin/pull/4145))

### Correções de bugs

* fix(binding): erro de valor vazio ([#2169](https://github.com/gin-gonic/gin/pull/2169))
* fix(binding): melhorar manipulação de slice/array vazio em binding de forma ([#4380](https://github.com/gin-gonic/gin/pull/4380))
* fix(context): manipulação de ClientIP para valores de cabeçalho X-Forwarded-For múltiplos ([#4472](https://github.com/gin-gonic/gin/pull/4472))
* fix(debug): incompatibilidade de versão ([#4403](https://github.com/gin-gonic/gin/pull/4403))
* fix(gin): fechar os.File em RunFd para evitar vazamento de recursos ([#4422](https://github.com/gin-gonic/gin/pull/4422))
* fix(gin): rotas de dois pontos literais não funcionando com engine.Handler() ([#4415](https://github.com/gin-gonic/gin/pull/4415))
* fix(recover): suprimir http.ErrAbortHandler em recover ([#4336](https://github.com/gin-gonic/gin/pull/4336))
* fix(render): escrever comprimento do conteúdo em Data.Render ([#4206](https://github.com/gin-gonic/gin/pull/4206))
* fix(response): refinar comportamento de hijack para ciclo de vida de resposta ([#4373](https://github.com/gin-gonic/gin/pull/4373))
* fix(tree): pânico em findCaseInsensitivePathRec com RedirectFixedPath ([#4535](https://github.com/gin-gonic/gin/pull/4535))
* fix: Corrigir erros de digitação, melhorar clareza de documentação e remover código morto ([#4511](https://github.com/gin-gonic/gin/pull/4511))

### Aprimoramentos

* chore(binding): atualizar dependência bson para mongo-driver v2 ([#4549](https://github.com/gin-gonic/gin/pull/4549))
* chore(context): sempre confiar em cabeçalhos xff do unix socket ([#3359](https://github.com/gin-gonic/gin/pull/3359))
* chore(deps): atualizar golang.org/x/crypto para v0.45.0 ([#4449](https://github.com/gin-gonic/gin/pull/4449))
* chore(deps): atualizar quic-go para v0.57.1 ([#4532](https://github.com/gin-gonic/gin/pull/4532))
* chore(logger): permitir pular saída de string de consulta ([#4547](https://github.com/gin-gonic/gin/pull/4547))
* chore(response): evitar pânico de Flush() quando `http.Flusher` ([#4479](https://github.com/gin-gonic/gin/pull/4479))

### Refatoração

* refactor(binding): usar maps.Copy para manipulação de mapa mais limpa ([#4352](https://github.com/gin-gonic/gin/pull/4352))
* refactor(context): omitir nomes de valores de retorno ([#4395](https://github.com/gin-gonic/gin/pull/4395))
* refactor(context): substituir IPs de localhost codificados por constantes ([#4481](https://github.com/gin-gonic/gin/pull/4481))
* refactor(context): usando maps.Clone ([#4333](https://github.com/gin-gonic/gin/pull/4333))
* refactor(ginS): usar sync.OnceValue para simplificar função engine ([#4314](https://github.com/gin-gonic/gin/pull/4314))
* refactor(recovery): comparação inteligente de erros ([#4142](https://github.com/gin-gonic/gin/pull/4142))
* refactor(utils): mover funções de utilitários para utils.go ([#4467](https://github.com/gin-gonic/gin/pull/4467))
* refactor: for loop pode ser modernizado usando range sobre int ([#4392](https://github.com/gin-gonic/gin/pull/4392))
* refactor: substituir números mágicos por constantes nomeadas em bodyAllowedForStatus ([#4529](https://github.com/gin-gonic/gin/pull/4529))
* refactor: usar b.Loop() para simplificar o código e melhorar o desempenho ([#4389](https://github.com/gin-gonic/gin/pull/4389), [#4432](https://github.com/gin-gonic/gin/pull/4432))

### Atualizações de processo de compilação / CI

* ci(bot): aumentar frequência e agrupar atualizações de dependências ([#4367](https://github.com/gin-gonic/gin/pull/4367))
* ci(lint): refatorar asserções de teste e configuração de linter ([#4436](https://github.com/gin-gonic/gin/pull/4436))
* ci(sec): melhorar segurança de tipo e organização de servidor em middleware HTTP ([#4437](https://github.com/gin-gonic/gin/pull/4437))
* ci(sec): agendar verificações de segurança do Trivy para executar diariamente à meia-noite UTC ([#4439](https://github.com/gin-gonic/gin/pull/4439))
* ci: substituir fluxo de trabalho de verificação de vulnerabilidade por integração do Trivy ([#4421](https://github.com/gin-gonic/gin/pull/4421))
* ci: atualizar fluxos de trabalho de CI e padronizar aspas de configuração do Trivy ([#4531](https://github.com/gin-gonic/gin/pull/4531))
* ci: atualizar suporte de versão Go para 1.25+ em CI e documentação ([#4550](https://github.com/gin-gonic/gin/pull/4550))

### Atualizações de documentação

* docs(README): adicionar crachá de verificação de segurança do Trivy ([#4426](https://github.com/gin-gonic/gin/pull/4426))
* docs(context): adicionar comentários de exemplo para métodos ShouldBind\* ([#4428](https://github.com/gin-gonic/gin/pull/4428))
* docs(context): corrigir alguns comentários ([#4396](https://github.com/gin-gonic/gin/pull/4396))
* docs(context): corrigir nome de função errado em comentário ([#4382](https://github.com/gin-gonic/gin/pull/4382))
* docs(readme): revitalizar e expandir documentação para clareza e completude ([#4362](https://github.com/gin-gonic/gin/pull/4362))
* docs: anunciar lançamento do Gin 1.11.0 com link do blog ([#4363](https://github.com/gin-gonic/gin/pull/4363))
* docs: documentar e finalizar lançamento do Gin v1.12.0 ([#4551](https://github.com/gin-gonic/gin/pull/4551))
* docs: revitalizar modelos de contribuição e suporte do GitHub ([#4364](https://github.com/gin-gonic/gin/pull/4364))
* docs: revitalizar diretrizes de contribuição com instruções abrangentes ([#4365](https://github.com/gin-gonic/gin/pull/4365))
* docs: atualizar documentação para refletir alterações de versão do Go ([#4552](https://github.com/gin-gonic/gin/pull/4552))
* docs: atualizar instruções de documentação de recursos para link de documentação quebrado ([#4508](https://github.com/gin-gonic/gin/pull/4508))

### Desempenho

* perf(path): substituir regex por funções personalizadas em redirectTrailingSlash ([#4414](https://github.com/gin-gonic/gin/pull/4414))
* perf(recovery): otimizar leitura de linha na função stack ([#4466](https://github.com/gin-gonic/gin/pull/4466))
* perf(tree): otimizar análise de caminho usando strings.Count ([#4246](https://github.com/gin-gonic/gin/pull/4246))
* perf(tree): reduzir alocações em findCaseInsensitivePath ([#4417](https://github.com/gin-gonic/gin/pull/4417))

### Testes

* test(benchmarks): corrigir nome de função incorreto ([#4375](https://github.com/gin-gonic/gin/pull/4375))
* test(bytesconv): adicionar testes para casos vazio/nil ([#4454](https://github.com/gin-gonic/gin/pull/4454))
* test(context): usar constante http.StatusContinue em vez de número mágico 100 ([#4542](https://github.com/gin-gonic/gin/pull/4542))
* test(debug): melhorar cobertura de testes de debug.go para 100% ([#4404](https://github.com/gin-gonic/gin/pull/4404))
* test(gin): adicionar cobertura de teste abrangente para pacote ginS ([#4442](https://github.com/gin-gonic/gin/pull/4442))
* test(gin): resolver condições de corrida em testes de integração ([#4453](https://github.com/gin-gonic/gin/pull/4453))
* test(render): adicionar testes abrangentes de manipulação de erros ([#4541](https://github.com/gin-gonic/gin/pull/4541))
* test(render): adicionar testes abrangentes para renderização MsgPack ([#4537](https://github.com/gin-gonic/gin/pull/4537))
