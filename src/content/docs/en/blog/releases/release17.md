---
title: "Gin 1.7.0 is released"
linkTitle: "Gin 1.7.0 is released"
lastUpdated: 2021-04-08
---

### CHANGELOG


#### BUGFIXES
  * Fix compile error from [#2572](https://github.com/gin-gonic/gin/pull/2572) ([#2600](https://github.com/gin-gonic/gin/pull/2600))
  * Fix: print headers without Authorization header on broken pipe ([#2528](https://github.com/gin-gonic/gin/pull/2528))
  * Fix(tree): reassign fullpath when register new node ([#2366](https://github.com/gin-gonic/gin/pull/2366))


#### ENHANCEMENTS
  * Support params and exact routes without creating conflicts ([#2663](https://github.com/gin-gonic/gin/pull/2663))
  * Chore: improve render string performance ([#2365](https://github.com/gin-gonic/gin/pull/2365))
  * Sync route tree to httprouter latest code ([#2368](https://github.com/gin-gonic/gin/pull/2368))
  * Chore: rename getQueryCache/getFormCache to initQueryCache/initFormCa ([#2375](https://github.com/gin-gonic/gin/pull/2375))
  * Chore(performance): improve countParams ([#2378](https://github.com/gin-gonic/gin/pull/2378))
  * Remove some functions that have the same effect as the bytes package ([#2387](https://github.com/gin-gonic/gin/pull/2387))
  * Update: SetMode function ([#2321](https://github.com/gin-gonic/gin/pull/2321))
  * Remove a unused type SecureJSONPrefix ([#2391](https://github.com/gin-gonic/gin/pull/2391))
  * Add a redirect sample for POST method ([#2389](https://github.com/gin-gonic/gin/pull/2389))
  * Add CustomRecovery builtin middleware ([#2322](https://github.com/gin-gonic/gin/pull/2322))
  * Binding: avoid 2038 problem on 32-bit architectures ([#2450](https://github.com/gin-gonic/gin/pull/2450))
  * Prevent panic in Context.GetQuery() when there is no Request ([#2412](https://github.com/gin-gonic/gin/pull/2412))
  * Add GetUint and GetUint64 method on gin.context ([#2487](https://github.com/gin-gonic/gin/pull/2487))
  * Update content-disposition header to MIME-style ([#2512](https://github.com/gin-gonic/gin/pull/2512))
  * Reduce allocs and improve the render `WriteString` ([#2508](https://github.com/gin-gonic/gin/pull/2508))
  * Implement ".Unwrap() error" on Error type ([#2525](https://github.com/gin-gonic/gin/issues/2525)) ([#2526](https://github.com/gin-gonic/gin/pull/2526))
  * Allow bind with a map[string]string ([#2484](https://github.com/gin-gonic/gin/pull/2484))
  * Chore: update tree ([#2371](https://github.com/gin-gonic/gin/pull/2371))
  * Support binding for slice/array obj [Rewrite] ([#2302](https://github.com/gin-gonic/gin/pull/2302))
  * Basic auth: fix timing oracle ([#2609](https://github.com/gin-gonic/gin/pull/2609))
  * Add mixed param and non-param paths (port of httprouter[#329](https://github.com/gin-gonic/gin/issues/329)) ([#2663](https://github.com/gin-gonic/gin/pull/2663))
  * Feat(engine): add trustedproxies and remoteIP ([#2632](https://github.com/gin-gonic/gin/pull/2632))
