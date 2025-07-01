---
lastUpdated: 2022-05-30
linkTitle: 'Gin 1.8.0がリリースされました'
title: 'Gin 1.8.0がリリースされました'
---

### CHANGELOG

#### Break Changes
  * TrustedProxies: Add default IPv6 support and refactor
    ([#2967](https://github.com/gin-gonic/gin/pull/2967)). Please replace
    `RemoteIP() (net.IP, bool)` with `RemoteIP() net.IP`
  * gin.Context with fallback value from gin.Context.Request.Context()
    ([#2751](https://github.com/gin-gonic/gin/pull/2751))

#### BUGFIXES
  * Fixed SetOutput() panics on go 1.17
    ([#2861](https://github.com/gin-gonic/gin/pull/2861))
  * Fix: wrong when wildcard follows named param
    ([#2983](https://github.com/gin-gonic/gin/pull/2983))
  * Fix: missing sameSite when do context.reset()
    ([#3123](https://github.com/gin-gonic/gin/pull/3123))


#### ENHANCEMENTS
  * Use Header() instead of deprecated HeaderMap
    ([#2694](https://github.com/gin-gonic/gin/pull/2694))
  * RouterGroup.Handle regular match optimization of http method
    ([#2685](https://github.com/gin-gonic/gin/pull/2685))
  * Add support go-json, another drop-in json replacement
    ([#2680](https://github.com/gin-gonic/gin/pull/2680))
  * Use errors.New to replace fmt.Errorf will much better
    ([#2707](https://github.com/gin-gonic/gin/pull/2707))
  * Use Duration.Truncate for truncating precision
    ([#2711](https://github.com/gin-gonic/gin/pull/2711))
  * Get client IP when using Cloudflare
    ([#2723](https://github.com/gin-gonic/gin/pull/2723))
  * Optimize code adjust
    ([#2700](https://github.com/gin-gonic/gin/pull/2700))
  * Optimize code and reduce code cyclomatic complexity
    ([#2737](https://github.com/gin-gonic/gin/pull/2737))
  * gin.Context with fallback value from gin.Context.Request.Context()
    ([#2751](https://github.com/gin-gonic/gin/pull/2751))
  * Improve sliceValidateError.Error performance
    ([#2765](https://github.com/gin-gonic/gin/pull/2765))
  * Support custom struct tag
    ([#2720](https://github.com/gin-gonic/gin/pull/2720))
  * Improve router group tests
    ([#2787](https://github.com/gin-gonic/gin/pull/2787))
  * Fallback Context.Deadline() Context.Done() Context.Err() to
    Context.Request.Context()
    ([#2769](https://github.com/gin-gonic/gin/pull/2769))
  * Some codes optimize [#2830](https://github.com/gin-gonic/gin/pull/2830),
    [#2834](https://github.com/gin-gonic/gin/pull/2834),
    [#2838](https://github.com/gin-gonic/gin/pull/2838),
    [#2837](https://github.com/gin-gonic/gin/pull/2837),
    [#2788](https://github.com/gin-gonic/gin/pull/2788),
    [#2848](https://github.com/gin-gonic/gin/pull/2848),
    [#2851](https://github.com/gin-gonic/gin/pull/2851),
    [#2701](https://github.com/gin-gonic/gin/pull/2701)
  * Test(route): expose performRequest func
    ([#3012](https://github.com/gin-gonic/gin/pull/3012))
  * Support h2c with prior knowledge
    ([#1398](https://github.com/gin-gonic/gin/pull/1398))
  * Feat attachment filename support utf8
    ([#3071](https://github.com/gin-gonic/gin/pull/3071))
  * Feat: add StaticFileFS
    ([#2749](https://github.com/gin-gonic/gin/pull/2749))
  * Feat(context): return GIN Context from Value method
    ([#2825](https://github.com/gin-gonic/gin/pull/2825))
  * Feat: automatically SetMode to TestMode when run go test
    ([#3139](https://github.com/gin-gonic/gin/pull/3139))
  * Add TOML binding for gin
    ([#3081](https://github.com/gin-gonic/gin/pull/3081))
  * IPv6 add default trusted proxies
    ([#3033](https://github.com/gin-gonic/gin/pull/3033))

#### DOCS
  * Add note about nomsgpack tag to the readme
    ([#2703](https://github.com/gin-gonic/gin/pull/2703))
