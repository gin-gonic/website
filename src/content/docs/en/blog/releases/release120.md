---
title: "Gin 1.12.0 is released"
linkTitle: "Gin 1.12.0 is released"
lastUpdated: 2026-02-28
---

## Gin v1.12.0

### Features

* feat(binding): add support for encoding.UnmarshalText in uri/query binding ([#4203](https://github.com/gin-gonic/gin/pull/4203))
* feat(context): add GetError and GetErrorSlice methods for error retrieval ([#4502](https://github.com/gin-gonic/gin/pull/4502))
* feat(context): add Protocol Buffers support to content negotiation ([#4423](https://github.com/gin-gonic/gin/pull/4423))
* feat(context): implemented Delete method ([#4296](https://github.com/gin-gonic/gin/pull/4296))
* feat(gin): add option to use escaped path ([#4420](https://github.com/gin-gonic/gin/pull/4420))
* feat(logger): color latency ([#4146](https://github.com/gin-gonic/gin/pull/4146))
* feat(render): add bson protocol ([#4145](https://github.com/gin-gonic/gin/pull/4145))

### Bug Fixes

* fix(binding): empty value error ([#2169](https://github.com/gin-gonic/gin/pull/2169))
* fix(binding): improve empty slice/array handling in form binding ([#4380](https://github.com/gin-gonic/gin/pull/4380))
* fix(context): ClientIP handling for multiple X-Forwarded-For header values ([#4472](https://github.com/gin-gonic/gin/pull/4472))
* fix(debug): version mismatch ([#4403](https://github.com/gin-gonic/gin/pull/4403))
* fix(gin): close os.File in RunFd to prevent resource leak ([#4422](https://github.com/gin-gonic/gin/pull/4422))
* fix(gin): literal colon routes not working with engine.Handler() ([#4415](https://github.com/gin-gonic/gin/pull/4415))
* fix(recover): suppress http.ErrAbortHandler in recover ([#4336](https://github.com/gin-gonic/gin/pull/4336))
* fix(render): write content length in Data.Render ([#4206](https://github.com/gin-gonic/gin/pull/4206))
* fix(response): refine hijack behavior for response lifecycle ([#4373](https://github.com/gin-gonic/gin/pull/4373))
* fix(tree): panic in findCaseInsensitivePathRec with RedirectFixedPath ([#4535](https://github.com/gin-gonic/gin/pull/4535))
* fix: Correct typos, improve documentation clarity, and remove dead code ([#4511](https://github.com/gin-gonic/gin/pull/4511))

### Enhancements

* chore(binding): upgrade bson dependency to mongo-driver v2 ([#4549](https://github.com/gin-gonic/gin/pull/4549))
* chore(context): always trust xff headers from unix socket ([#3359](https://github.com/gin-gonic/gin/pull/3359))
* chore(deps): upgrade golang.org/x/crypto to v0.45.0 ([#4449](https://github.com/gin-gonic/gin/pull/4449))
* chore(deps): upgrade quic-go to v0.57.1 ([#4532](https://github.com/gin-gonic/gin/pull/4532))
* chore(logger): allow skipping query string output ([#4547](https://github.com/gin-gonic/gin/pull/4547))
* chore(response): prevent Flush() panic when `http.Flusher` ([#4479](https://github.com/gin-gonic/gin/pull/4479))

### Refactor

* refactor(binding): use maps.Copy for cleaner map handling ([#4352](https://github.com/gin-gonic/gin/pull/4352))
* refactor(context): omit the return value names ([#4395](https://github.com/gin-gonic/gin/pull/4395))
* refactor(context): replace hardcoded localhost IPs with constants ([#4481](https://github.com/gin-gonic/gin/pull/4481))
* refactor(context): using maps.Clone ([#4333](https://github.com/gin-gonic/gin/pull/4333))
* refactor(ginS): use sync.OnceValue to simplify engine function ([#4314](https://github.com/gin-gonic/gin/pull/4314))
* refactor(recovery): smart error comparison ([#4142](https://github.com/gin-gonic/gin/pull/4142))
* refactor(utils): move util functions to utils.go ([#4467](https://github.com/gin-gonic/gin/pull/4467))
* refactor: for loop can be modernized using range over int ([#4392](https://github.com/gin-gonic/gin/pull/4392))
* refactor: replace magic numbers with named constants in bodyAllowedForStatus ([#4529](https://github.com/gin-gonic/gin/pull/4529))
* refactor: use b.Loop() to simplify the code and improve performance ([#4389](https://github.com/gin-gonic/gin/pull/4389), [#4432](https://github.com/gin-gonic/gin/pull/4432))

### Build process updates / CI

* ci(bot): increase frequency and group updates for dependencies ([#4367](https://github.com/gin-gonic/gin/pull/4367))
* ci(lint): refactor test assertions and linter configuration ([#4436](https://github.com/gin-gonic/gin/pull/4436))
* ci(sec): improve type safety and server organization in HTTP middleware ([#4437](https://github.com/gin-gonic/gin/pull/4437))
* ci(sec): schedule Trivy security scans to run daily at midnight UTC ([#4439](https://github.com/gin-gonic/gin/pull/4439))
* ci: replace vulnerability scanning workflow with Trivy integration ([#4421](https://github.com/gin-gonic/gin/pull/4421))
* ci: update CI workflows and standardize Trivy config quotes ([#4531](https://github.com/gin-gonic/gin/pull/4531))
* ci: update Go version support to 1.25+ across CI and docs ([#4550](https://github.com/gin-gonic/gin/pull/4550))

### Documentation updates

* docs(README): add a Trivy security scan badge ([#4426](https://github.com/gin-gonic/gin/pull/4426))
* docs(context): add example comments for ShouldBind\* methods ([#4428](https://github.com/gin-gonic/gin/pull/4428))
* docs(context): fix some comments ([#4396](https://github.com/gin-gonic/gin/pull/4396))
* docs(context): fix wrong function name in comment ([#4382](https://github.com/gin-gonic/gin/pull/4382))
* docs(readme): revamp and expand documentation for clarity and completeness ([#4362](https://github.com/gin-gonic/gin/pull/4362))
* docs: announce Gin 1.11.0 release with blog link ([#4363](https://github.com/gin-gonic/gin/pull/4363))
* docs: document and finalize Gin v1.12.0 release ([#4551](https://github.com/gin-gonic/gin/pull/4551))
* docs: revamp GitHub contribution and support templates ([#4364](https://github.com/gin-gonic/gin/pull/4364))
* docs: revamp contributing guidelines with comprehensive instructions ([#4365](https://github.com/gin-gonic/gin/pull/4365))
* docs: update documentation to reflect Go version changes ([#4552](https://github.com/gin-gonic/gin/pull/4552))
* docs: update feature documentation instructions for broken doc link ([#4508](https://github.com/gin-gonic/gin/pull/4508))

### Performance

* perf(path): replace regex with custom functions in redirectTrailingSlash ([#4414](https://github.com/gin-gonic/gin/pull/4414))
* perf(recovery): optimize line reading in stack function ([#4466](https://github.com/gin-gonic/gin/pull/4466))
* perf(tree): optimize path parsing using strings.Count ([#4246](https://github.com/gin-gonic/gin/pull/4246))
* perf(tree): reduce allocations in findCaseInsensitivePath ([#4417](https://github.com/gin-gonic/gin/pull/4417))

### Tests

* test(benchmarks): fix the incorrect function name ([#4375](https://github.com/gin-gonic/gin/pull/4375))
* test(bytesconv): add tests for empty/nil cases ([#4454](https://github.com/gin-gonic/gin/pull/4454))
* test(context): use http.StatusContinue constant instead of magic number 100 ([#4542](https://github.com/gin-gonic/gin/pull/4542))
* test(debug): improve the test coverage of debug.go to 100% ([#4404](https://github.com/gin-gonic/gin/pull/4404))
* test(gin): Add comprehensive test coverage for ginS package ([#4442](https://github.com/gin-gonic/gin/pull/4442))
* test(gin): resolve race conditions in integration tests ([#4453](https://github.com/gin-gonic/gin/pull/4453))
* test(render): add comprehensive error handling tests ([#4541](https://github.com/gin-gonic/gin/pull/4541))
* test(render): add comprehensive tests for MsgPack render ([#4537](https://github.com/gin-gonic/gin/pull/4537))
