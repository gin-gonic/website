---
title: "Gin 1.5.0 is released"
linkTitle: "Gin 1.5.0 is released"
date: 2019-11-28
---

### CHANGELOG

#### Feature

- [NEW] Now you can parse the inline lowercase start structure [#1893](https://github.com/gin-gonic/gin/pull/1893)
- [NEW] **[Break-Backward]** Hold matched route full path in the Context [#1826](https://github.com/gin-gonic/gin/pull/1826)
- [NEW] Add context param query cache [#1450](https://github.com/gin-gonic/gin/pull/1450)
- [NEW] Add support of multipart multi files [#1949](https://github.com/gin-gonic/gin/pull/1949)
- [NEW] Support bind http header param [#1957](https://github.com/gin-gonic/gin/pull/1957)
- [NEW] Support bind unix time [#1980](https://github.com/gin-gonic/gin/pull/1980)
- [NEW] Support negative Content-Length in DataFromReader [#1981](https://github.com/gin-gonic/gin/pull/1981)
- [NEW] Add DisallowUnknownFields() in gin.Context.BindJSON() [#2028](https://github.com/gin-gonic/gin/pull/2028)
- [NEW] Use specific `net.Listener` with Engine.RunListener() [#2023](https://github.com/gin-gonic/gin/pull/2023)

#### Bug fix

- [FIX] Use DefaultWriter and DefaultErrorWriter for debug messages [#1891](https://github.com/gin-gonic/gin/pull/1891)
- [FIX] Some code improvements [#1909](https://github.com/gin-gonic/gin/pull/1909)
- [FIX] Use encode replace json marshal increase json encoder speed [#1546](https://github.com/gin-gonic/gin/pull/1546)
- [FIX] Fix context.Params race condition on Copy() [#1841](https://github.com/gin-gonic/gin/pull/1841)
- [FIX] Improve GetQueryMap performance [#1918](https://github.com/gin-gonic/gin/pull/1918)
- [FIX] Improve get post data [#1920](https://github.com/gin-gonic/gin/pull/1920)
- [FIX] Use context instead of x/net/context [#1922](https://github.com/gin-gonic/gin/pull/1922)
- [FIX] Attempt to fix PostForm cache bug [#1931](https://github.com/gin-gonic/gin/pull/1931)
- [FIX] **[Break-Backward]** Drop support for go1.8 and go1.9 [#1933](https://github.com/gin-gonic/gin/pull/1933)
- [FIX] Bugfix for the FullPath feature [#1919](https://github.com/gin-gonic/gin/pull/1919)
- [FIX] Gin1.5 bytes.Buffer to strings.Builder [#1939](https://github.com/gin-gonic/gin/pull/1939)
- [FIX] Upgrade github.com/ugorji/go/codec [#1969](https://github.com/gin-gonic/gin/pull/1969)
- [FIX] Simplify code [#2004](https://github.com/gin-gonic/gin/pull/2004)
- [FIX] Identify terminal on a RISC-V architecture for auto-colored logs [#2019](https://github.com/gin-gonic/gin/pull/2019)
- [FIX] **[Break-Backward]** Context.JSONP() now expects a semicolon (;) at the end [#2007](https://github.com/gin-gonic/gin/pull/2007)
- [FIX] **[Break-Backward]** Upgrade validator version to v9 [#1015](https://github.com/gin-gonic/gin/pull/1015)
- [FIX] Fix some typo [#2079](https://github.com/gin-gonic/gin/pull/2079) [#2080](https://github.com/gin-gonic/gin/pull/2080)
- [FIX] Relocate binding body tests [#2086](https://github.com/gin-gonic/gin/pull/2086)
- [FIX] Use Writer in Context.Status [#1606](https://github.com/gin-gonic/gin/pull/1606)
- [FIX] `Engine.RunUnix()` now returns the error if it can't change the file mode [#2093](https://github.com/gin-gonic/gin/pull/2093)
- [FIX] `RouterGroup.StaticFS()` leaked files. Now it closes them. [#2118](https://github.com/gin-gonic/gin/pull/2118)
- [FIX] `Context.Request.FormFile` leaked file, now it closes it [#2114](https://github.com/gin-gonic/gin/pull/2114)
- [FIX] Ignore walking on `form:"-"` mapping [#1943](https://github.com/gin-gonic/gin/pull/1943)
- [REFACTOR] **[Break-Backward]** Use encode replace json marshal increase json encoder speed [#1546 ](https://github.com/gin-gonic/gin/pull/1546)

