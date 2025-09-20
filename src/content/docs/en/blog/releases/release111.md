---
title: "Gin 1.11.0 is released"
linkTitle: "Gin 1.11.0 is released"
lastUpdated: 2025-09-20
---

## Gin v1.11.0

### Features

* feat(gin): Experimental support for HTTP/3 using quic-go/quic-go ([#3210](https://github.com/gin-gonic/gin/pull/3210))
* feat(form): add array collection format in form binding ([#3986](https://github.com/gin-gonic/gin/pull/3986)), add custom string slice for form tag unmarshal ([#3970](https://github.com/gin-gonic/gin/pull/3970))
* feat(binding): add BindPlain ([#3904](https://github.com/gin-gonic/gin/pull/3904))
* feat(fs): Export, test and document OnlyFilesFS ([#3939](https://github.com/gin-gonic/gin/pull/3939))
* feat(binding): add support for unixMilli and unixMicro ([#4190](https://github.com/gin-gonic/gin/pull/4190))
* feat(form): Support default values for collections in form binding ([#4048](https://github.com/gin-gonic/gin/pull/4048))
* feat(context): GetXxx added support for more go native types ([#3633](https://github.com/gin-gonic/gin/pull/3633))

### Enhancements

* perf(context): optimize getMapFromFormData performance ([#4339](https://github.com/gin-gonic/gin/pull/4339))
* refactor(tree): replace string(/) with "/" in node.insertChild ([#4354](https://github.com/gin-gonic/gin/pull/4354))
* refactor(render): remove headers parameter from writeHeader ([#4353](https://github.com/gin-gonic/gin/pull/4353))
* refactor(context): simplify "GetType()" functions ([#4080](https://github.com/gin-gonic/gin/pull/4080))
* refactor(slice): simplify SliceValidationError Error method ([#3910](https://github.com/gin-gonic/gin/pull/3910))
* refactor(context):Avoid using filepath.Dir twice in SaveUploadedFile ([#4181](https://github.com/gin-gonic/gin/pull/4181))
* refactor(context): refactor context handling and improve test robustness ([#4066](https://github.com/gin-gonic/gin/pull/4066))
* refactor(binding): use strings.Cut to replace strings.Index ([#3522](https://github.com/gin-gonic/gin/pull/3522))
* refactor(context): add an optional permission parameter to SaveUploadedFile ([#4068](https://github.com/gin-gonic/gin/pull/4068))
* refactor(context): verify URL is Non-nil in initQueryCache() ([#3969](https://github.com/gin-gonic/gin/pull/3969))
* refactor(context): YAML judgment logic in Negotiate ([#3966](https://github.com/gin-gonic/gin/pull/3966))
* tree: replace the self-defined 'min' to official one ([#3975](https://github.com/gin-gonic/gin/pull/3975))
* context: Remove redundant filepath.Dir usage ([#4181](https://github.com/gin-gonic/gin/pull/4181))

### Bug Fixes

* fix: prevent middleware re-entry issue in HandleContext ([#3987](https://github.com/gin-gonic/gin/pull/3987))
* fix(binding): prevent duplicate decoding and add validation in decodeToml ([#4193](https://github.com/gin-gonic/gin/pull/4193))
* fix(gin): Do not panic when handling method not allowed on empty tree ([#4003](https://github.com/gin-gonic/gin/pull/4003))
* fix(gin): data race warning for gin mode ([#1580](https://github.com/gin-gonic/gin/pull/1580))
* fix(context): verify URL is Non-nil in initQueryCache() ([#3969](https://github.com/gin-gonic/gin/pull/3969))
* fix(context): YAML judgment logic in Negotiate ([#3966](https://github.com/gin-gonic/gin/pull/3966))
* fix(context): check handler is nil ([#3413](https://github.com/gin-gonic/gin/pull/3413))
* fix(readme): fix broken link to English documentation ([#4222](https://github.com/gin-gonic/gin/pull/4222))
* fix(tree): Keep panic infos consistent when wildcard type build faild ([#4077](https://github.com/gin-gonic/gin/pull/4077))

### Build process updates / CI

* ci: integrate Trivy vulnerability scanning into CI workflow ([#4359](https://github.com/gin-gonic/gin/pull/4359))
* ci: support Go 1.25 in CI/CD ([#4341](https://github.com/gin-gonic/gin/pull/4341))
* build(deps): upgrade github.com/bytedance/sonic from v1.13.2 to v1.14.0 ([#4342](https://github.com/gin-gonic/gin/pull/4342))
* ci: add Go version 1.24 to GitHub Actions ([#4154](https://github.com/gin-gonic/gin/pull/4154))
* build: update Gin minimum Go version to 1.21 ([#3960](https://github.com/gin-gonic/gin/pull/3960))
* ci(lint): enable new linters (testifylint, usestdlibvars, perfsprint, etc.) ([#4010](https://github.com/gin-gonic/gin/pull/4010), [#4091](https://github.com/gin-gonic/gin/pull/4091), [#4090](https://github.com/gin-gonic/gin/pull/4090))
* ci(lint): update workflows and improve test request consistency ([#4126](https://github.com/gin-gonic/gin/pull/4126))

### Dependency updates

* chore(deps): bump google.golang.org/protobuf from 1.36.6 to 1.36.9 ([#4346](https://github.com/gin-gonic/gin/pull/4346), [#4356](https://github.com/gin-gonic/gin/pull/4356))
* chore(deps): bump github.com/stretchr/testify from 1.10.0 to 1.11.1 ([#4347](https://github.com/gin-gonic/gin/pull/4347))
* chore(deps): bump actions/setup-go from 5 to 6 ([#4351](https://github.com/gin-gonic/gin/pull/4351))
* chore(deps): bump github.com/quic-go/quic-go from 0.53.0 to 0.54.0 ([#4328](https://github.com/gin-gonic/gin/pull/4328))
* chore(deps): bump golang.org/x/net from 0.33.0 to 0.38.0 ([#4178](https://github.com/gin-gonic/gin/pull/4178), [#4221](https://github.com/gin-gonic/gin/pull/4221))
* chore(deps): bump github.com/go-playground/validator/v10 from 10.20.0 to 10.22.1 ([#4052](https://github.com/gin-gonic/gin/pull/4052))

### Documentation updates

* docs(changelog): update release notes for Gin v1.10.1 ([#4360](https://github.com/gin-gonic/gin/pull/4360))
* docs: Fixing English grammar mistakes and awkward sentence structure in doc/doc.md ([#4207](https://github.com/gin-gonic/gin/pull/4207))
* docs: update documentation and release notes for Gin v1.10.0 ([#3953](https://github.com/gin-gonic/gin/pull/3953))
* docs: fix typo in Gin Quick Start ([#3997](https://github.com/gin-gonic/gin/pull/3997))
* docs: fix comment and link issues ([#4205](https://github.com/gin-gonic/gin/pull/4205), [#3938](https://github.com/gin-gonic/gin/pull/3938))
* docs: fix route group example code ([#4020](https://github.com/gin-gonic/gin/pull/4020))
* docs(readme): add Portuguese documentation ([#4078](https://github.com/gin-gonic/gin/pull/4078))
* docs(context): fix some function names in comment ([#4079](https://github.com/gin-gonic/gin/pull/4079))
