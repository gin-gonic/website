---
title: "Gin 1.6.0 is released"
linkTitle: "Gin 1.6.0 is released"
date: 2020-03-22
---

### CHANGELOG

#### BREAKING
  * chore(performance): Improve performance for adding RemoveExtraSlash flag [#2159](https://github.com/gin-gonic/gin/pull/2159)
  * drop support govendor [#2148](https://github.com/gin-gonic/gin/pull/2148)
  * Added support for SameSite cookie flag [#1615](https://github.com/gin-gonic/gin/pull/1615)

#### FEATURES
  * add yaml negotitation [#2220](https://github.com/gin-gonic/gin/pull/2220)
  * FileFromFS [#2112](https://github.com/gin-gonic/gin/pull/2112)

#### BUGFIXES
  * Unix Socket Handling [#2280](https://github.com/gin-gonic/gin/pull/2280)
  * Use json marshall in context json to fix breaking new line issue. Fixes #2209 [#2228](https://github.com/gin-gonic/gin/pull/2228)
  * fix accept incoming network connections [#2216](https://github.com/gin-gonic/gin/pull/2216)
  * Fixed a bug in the calculation of the maximum number of parameters [#2166](https://github.com/gin-gonic/gin/pull/2166)
  * [FIX] allow empty headers on DataFromReader [#2121](https://github.com/gin-gonic/gin/pull/2121)
  * Add mutex for protect Context.Keys map [#1391](https://github.com/gin-gonic/gin/pull/1391)

#### ENHANCEMENTS
  * Add mitigation for log injection [#2277](https://github.com/gin-gonic/gin/pull/2277)
  * tree: range over nodes values [#2229](https://github.com/gin-gonic/gin/pull/2229)
  * tree: remove duplicate assignment [#2222](https://github.com/gin-gonic/gin/pull/2222)
  * chore: upgrade go-isatty and json-iterator/go [#2215](https://github.com/gin-gonic/gin/pull/2215)
  * path: sync code with httprouter [#2212](https://github.com/gin-gonic/gin/pull/2212)
  * Use zero-copy approach to convert types between string and byte slice [#2206](https://github.com/gin-gonic/gin/pull/2206)
  * Reuse bytes when cleaning the URL paths [#2179](https://github.com/gin-gonic/gin/pull/2179)
  * tree: remove one else statement [#2177](https://github.com/gin-gonic/gin/pull/2177)
  * tree: sync httprouter update (#2173) (#2172) [#2171](https://github.com/gin-gonic/gin/pull/2171)
  * tree: sync part httprouter codes and reduce if/else [#2163](https://github.com/gin-gonic/gin/pull/2163)
  * use http method constant [#2155](https://github.com/gin-gonic/gin/pull/2155)
  * upgrade go-validator to v10 [#2149](https://github.com/gin-gonic/gin/pull/2149)
  * Refactor redirect request in gin.go [#1970](https://github.com/gin-gonic/gin/pull/1970)
  * Add build tag nomsgpack [#1852](https://github.com/gin-gonic/gin/pull/1852)

#### DOCS
  * docs(path): improve comments [#2223](https://github.com/gin-gonic/gin/pull/2223)
  * Renew README to fit the modification of SetCookie method [#2217](https://github.com/gin-gonic/gin/pull/2217)
  * Fix spelling [#2202](https://github.com/gin-gonic/gin/pull/2202)
  * Remove broken link from README. [#2198](https://github.com/gin-gonic/gin/pull/2198)
  * Update docs on Context.Done(), Context.Deadline() and Context.Err() [#2196](https://github.com/gin-gonic/gin/pull/2196)
  * Update validator to v10 [#2190](https://github.com/gin-gonic/gin/pull/2190)
  * upgrade go-validator to v10 for README [#2189](https://github.com/gin-gonic/gin/pull/2189)
  * Update to currently output [#2188](https://github.com/gin-gonic/gin/pull/2188)
  * Fix "Custom Validators" example [#2186](https://github.com/gin-gonic/gin/pull/2186)
  * Add project to README [#2165](https://github.com/gin-gonic/gin/pull/2165)
  * docs(benchmarks): for gin v1.5 [#2153](https://github.com/gin-gonic/gin/pull/2153)
  * Changed wording for clarity in README.md [#2122](https://github.com/gin-gonic/gin/pull/2122)

#### MISC
  * ci support go1.14 [#2262](https://github.com/gin-gonic/gin/pull/2262)
  * chore: upgrade depend version [#2231](https://github.com/gin-gonic/gin/pull/2231)
  * Drop support go1.10 [#2147](https://github.com/gin-gonic/gin/pull/2147)
  * fix comment in `mode.go` [#2129](https://github.com/gin-gonic/gin/pull/2129)
