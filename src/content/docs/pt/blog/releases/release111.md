---
title: "Gin 1.11.0 foi lançado"
linkTitle: "Gin 1.11.0 foi lançado"
lastUpdated: 2024-09-20
---

## Gin v1.11.0

### Novidades

* feat(gin): Suporte experimental para HTTP/3 usando quic-go/quic-go ([#3210](https://github.com/gin-gonic/gin/pull/3210))
* feat(form): adicionar formato de coleção de array no binding de formulário ([#3986](https://github.com/gin-gonic/gin/pull/3986)), adicionar slice de string personalizado para unmarshal de tag form ([#3970](https://github.com/gin-gonic/gin/pull/3970))
* feat(binding): adicionar BindPlain ([#3904](https://github.com/gin-gonic/gin/pull/3904))
* feat(fs): Exportar, testar e documentar OnlyFilesFS ([#3939](https://github.com/gin-gonic/gin/pull/3939))
* feat(binding): adicionar suporte para unixMilli e unixMicro ([#4190](https://github.com/gin-gonic/gin/pull/4190))
* feat(form): Suporte para valores padrão em coleções no binding de formulário ([#4048](https://github.com/gin-gonic/gin/pull/4048))
* feat(context): GetXxx agora suporta mais tipos nativos do Go ([#3633](https://github.com/gin-gonic/gin/pull/3633))

### Melhorias

* perf(context): otimizar a performance do getMapFromFormData ([#4339](https://github.com/gin-gonic/gin/pull/4339))
* refactor(tree): substituir string(/) por "/" em node.insertChild ([#4354](https://github.com/gin-gonic/gin/pull/4354))
* refactor(render): remover parâmetro headers do writeHeader ([#4353](https://github.com/gin-gonic/gin/pull/4353))
* refactor(context): simplificar funções "GetType()" ([#4080](https://github.com/gin-gonic/gin/pull/4080))
* refactor(slice): simplificar o método Error de SliceValidationError ([#3910](https://github.com/gin-gonic/gin/pull/3910))
* refactor(context): evitar uso duplicado de filepath.Dir no SaveUploadedFile ([#4181](https://github.com/gin-gonic/gin/pull/4181))
* refactor(context): refatorar gerenciamento do contexto e melhorar robustez dos testes ([#4066](https://github.com/gin-gonic/gin/pull/4066))
* refactor(binding): usar strings.Cut para substituir strings.Index ([#3522](https://github.com/gin-gonic/gin/pull/3522))
* refactor(context): adicionar parâmetro de permissão opcional ao SaveUploadedFile ([#4068](https://github.com/gin-gonic/gin/pull/4068))
* refactor(context): verificar se URL não é nulo em initQueryCache() ([#3969](https://github.com/gin-gonic/gin/pull/3969))
* refactor(context): lógica de julgamento YAML em Negotiate ([#3966](https://github.com/gin-gonic/gin/pull/3966))
* tree: substituir função 'min' definida pelo usuário pela oficial ([#3975](https://github.com/gin-gonic/gin/pull/3975))
* context: remover uso redundante de filepath.Dir ([#4181](https://github.com/gin-gonic/gin/pull/4181))

### Correções de Bugs

* fix: impedir reentrada de middleware em HandleContext ([#3987](https://github.com/gin-gonic/gin/pull/3987))
* fix(binding): impedir decodificação duplicada e adicionar validação em decodeToml ([#4193](https://github.com/gin-gonic/gin/pull/4193))
* fix(gin): evitar panic ao processar método não permitido em árvore vazia ([#4003](https://github.com/gin-gonic/gin/pull/4003))
* fix(gin): aviso de race condition para modo gin ([#1580](https://github.com/gin-gonic/gin/pull/1580))
* fix(context): verificar se URL não é nulo em initQueryCache() ([#3969](https://github.com/gin-gonic/gin/pull/3969))
* fix(context): lógica de julgamento YAML em Negotiate ([#3966](https://github.com/gin-gonic/gin/pull/3966))
* fix(context): checagem de handler nulo ([#3413](https://github.com/gin-gonic/gin/pull/3413))
* fix(readme): corrigir link quebrado para a documentação em inglês ([#4222](https://github.com/gin-gonic/gin/pull/4222))
* fix(tree): manter informações de panic consistentes quando tipo wildcard falha ao construir ([#4077](https://github.com/gin-gonic/gin/pull/4077))

### Atualizações de Processo de Build / CI

* ci: integrar varredura de vulnerabilidade Trivy no workflow do CI ([#4359](https://github.com/gin-gonic/gin/pull/4359))
* ci: suporte ao Go 1.25 em CI/CD ([#4341](https://github.com/gin-gonic/gin/pull/4341))
* build(deps): atualização github.com/bytedance/sonic de v1.13.2 para v1.14.0 ([#4342](https://github.com/gin-gonic/gin/pull/4342))
* ci: adicionar versão Go 1.24 nas GitHub Actions ([#4154](https://github.com/gin-gonic/gin/pull/4154))
* build: atualizar versão mínima do Go para Gin para 1.21 ([#3960](https://github.com/gin-gonic/gin/pull/3960))
* ci(lint): habilitar novos linters (testifylint, usestdlibvars, perfsprint, etc.) ([#4010](https://github.com/gin-gonic/gin/pull/4010), [#4091](https://github.com/gin-gonic/gin/pull/4091), [#4090](https://github.com/gin-gonic/gin/pull/4090))
* ci(lint): atualizar workflows e melhorar a consistência dos testes ([#4126](https://github.com/gin-gonic/gin/pull/4126))

### Atualizações de Dependências

* chore(deps): atualizar google.golang.org/protobuf de 1.36.6 para 1.36.9 ([#4346](https://github.com/gin-gonic/gin/pull/4346), [#4356](https://github.com/gin-gonic/gin/pull/4356))
* chore(deps): atualizar github.com/stretchr/testify de 1.10.0 para 1.11.1 ([#4347](https://github.com/gin-gonic/gin/pull/4347))
* chore(deps): atualizar actions/setup-go de 5 para 6 ([#4351](https://github.com/gin-gonic/gin/pull/4351))
* chore(deps): atualizar github.com/quic-go/quic-go de 0.53.0 para 0.54.0 ([#4328](https://github.com/gin-gonic/gin/pull/4328))
* chore(deps): atualizar golang.org/x/net de 0.33.0 para 0.38.0 ([#4178](https://github.com/gin-gonic/gin/pull/4178), [#4221](https://github.com/gin-gonic/gin/pull/4221))
* chore(deps): atualizar github.com/go-playground/validator/v10 de 10.20.0 para 10.22.1 ([#4052](https://github.com/gin-gonic/gin/pull/4052))

### Atualizações de Documentação

* docs(changelog): atualizar notas de lançamento do Gin v1.10.1 ([#4360](https://github.com/gin-gonic/gin/pull/4360))
* docs: corrigir erros gramaticais e frases estranhas em inglês em doc/doc.md ([#4207](https://github.com/gin-gonic/gin/pull/4207))
* docs: atualizar documentação e notas de lançamento do Gin v1.10.0 ([#3953](https://github.com/gin-gonic/gin/pull/3953))
* docs: corrigir erro de digitação no Gin Quick Start ([#3997](https://github.com/gin-gonic/gin/pull/3997))
* docs: corrigir problemas de comentários e links ([#4205](https://github.com/gin-gonic/gin/pull/4205), [#3938](https://github.com/gin-gonic/gin/pull/3938))
* docs: corrigir código de exemplo de grupo de rotas ([#4020](https://github.com/gin-gonic/gin/pull/4020))
* docs(readme): adicionar documentação em português ([#4078](https://github.com/gin-gonic/gin/pull/4078))
* docs(context): corrigir alguns nomes de funções nos comentários ([#4079](https://github.com/gin-gonic/gin/pull/4079))
