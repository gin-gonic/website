---
lastUpdated: 2023-02-21
linkTitle: 'Gin 1.9.0がリリースされました'
title: 'Gin 1.9.0がリリースされました'
---

### CHANGELOG

#### BREAK CHANGES
  * Stop useless panicking in context and render
    ([#2150](https://github.com/gin-gonic/gin/pull/2150))

#### BUG FIXES
  * Fix(router): tree bug where loop index is not decremented
    ([#3460](https://github.com/gin-gonic/gin/pull/3460))
  * Fix(context): panic on NegotiateFormat - index out of range
    ([#3397](https://github.com/gin-gonic/gin/pull/3397))
  * Add escape logic for header
    ([#3500](https://github.com/gin-gonic/gin/pull/3500) and
    [#3503](https://github.com/gin-gonic/gin/pull/3503))

#### SECURITY
  * Fix the GO-2022-0969 and GO-2022-0288 vulnerabilities
    ([#3333](https://github.com/gin-gonic/gin/pull/3333))
  * Fix(security): vulnerability GO-2023-1571
    ([#3505](https://github.com/gin-gonic/gin/pull/3505))

#### ENHANCEMENTS
  * Feat: add sonic json support
    ([#3184](https://github.com/gin-gonic/gin/pull/3184))
  * Chore(file): Creates a directory named path
    ([#3316](https://github.com/gin-gonic/gin/pull/3316))
  * Fix: modify interface check way
    ([#3327](https://github.com/gin-gonic/gin/pull/3327))
  * Remove deprecated of package io/ioutil
    ([#3395](https://github.com/gin-gonic/gin/pull/3395))
  * Refactor: avoid calling strings.ToLower twice
    ([#3433](https://github.com/gin-gonic/gin/pull/3343))
  * Console logger HTTP status code bug fixed
    ([#3453](https://github.com/gin-gonic/gin/pull/3453))
  * Chore(yaml): upgrade dependency to v3 version
    ([#3456](https://github.com/gin-gonic/gin/pull/3456))
  * Chore(router): match method added to routergroup for multiple HTTP
    methods supporting ([#3464](https://github.com/gin-gonic/gin/pull/3464))
  * Chore(http): add support for go1.20 http.rwUnwrapper to
    gin.responseWriter ([#3489](https://github.com/gin-gonic/gin/pull/3489))

#### DOCS
  * Docs: update markdown format
    ([#3260](https://github.com/gin-gonic/gin/pull/3260))
  * Docs(readme): Add the TOML rendering example
    ([#3400](https://github.com/gin-gonic/gin/pull/3400))
  * Docs(readme): move more example to docs/doc.md
    ([#3449](https://github.com/gin-gonic/gin/pull/3449))
  * Docs: update markdown format
    ([#3446](https://github.com/gin-gonic/gin/pull/3446))
