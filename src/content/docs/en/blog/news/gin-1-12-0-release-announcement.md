---
title: "Announcing Gin 1.12.0: BSON Support, Context Improvements, Performance & More"
linkTitle: "Gin 1.12.0 Release Announcement"
lastUpdated: 2026-02-28
---

## Gin v1.12.0 Has Arrived

We're thrilled to announce the release of Gin v1.12.0, packed with new features, meaningful performance improvements, and a solid round of bug fixes. This release deepens Gin's support for modern protocols, refines the developer experience, and continues the project's tradition of staying fast and lean.

### 🌟 Key Features

- **BSON Protocol Support:** The render layer now supports BSON encoding, opening the door to more efficient binary data exchange ([#4145](https://github.com/gin-gonic/gin/pull/4145)).

- **New Context Methods:** Two new helpers make error handling cleaner and more idiomatic:
  - `GetError` and `GetErrorSlice` for type-safe error retrieval from context ([#4502](https://github.com/gin-gonic/gin/pull/4502))
  - `Delete` method for removing keys from context ([#38e7651](https://github.com/gin-gonic/gin/commit/38e7651))

- **Flexible Binding:** URI and query binding now honor `encoding.UnmarshalText`, giving you more control over custom type deserialization ([#4203](https://github.com/gin-gonic/gin/pull/4203)).

- **Escaped Path Option:** A new engine option lets you opt into using the escaped (raw) request path for routing ([#4420](https://github.com/gin-gonic/gin/pull/4420)).

- **Protocol Buffers in Content Negotiation:** `context` now supports Protocol Buffers as a negotiable content type, making gRPC-style responses easier to integrate ([#4423](https://github.com/gin-gonic/gin/pull/4423)).

- **Colorized Latency in Logger:** The default logger now renders latency with color, making it easier to spot slow requests at a glance ([#4146](https://github.com/gin-gonic/gin/pull/4146)).

### 🚀 Performance & Enhancements

- **Router Tree Optimizations:** Multiple improvements to the radix tree reduce allocations and speed up path parsing:
  - Fewer allocations in `findCaseInsensitivePath` ([#4417](https://github.com/gin-gonic/gin/pull/4417))
  - Path parsing using `strings.Count` for efficiency ([#4246](https://github.com/gin-gonic/gin/pull/4246))
  - Regex replaced with custom functions in `redirectTrailingSlash` ([#4414](https://github.com/gin-gonic/gin/pull/4414))
- **Recovery Optimization:** Stack trace reading is now more efficient ([#4466](https://github.com/gin-gonic/gin/pull/4466)).
- **Logger Improvements:** Query string output can now be skipped via configuration ([#4547](https://github.com/gin-gonic/gin/pull/4547)).
- **Unix Socket Trust:** `X-Forwarded-For` headers are now always trusted when requests arrive over a Unix socket ([#3359](https://github.com/gin-gonic/gin/pull/3359)).
- **Flush Safety:** `Flush()` no longer panics when the underlying `http.ResponseWriter` does not implement `http.Flusher` ([#4479](https://github.com/gin-gonic/gin/pull/4479)).
- **Code Quality Refactors:** Cleaner map handling with `maps.Copy` and `maps.Clone`, named constants replacing magic numbers, modernized range-over-int loops, and more ([#4352](https://github.com/gin-gonic/gin/pull/4352), [#4333](https://github.com/gin-gonic/gin/pull/4333), [#4529](https://github.com/gin-gonic/gin/pull/4529), [#4392](https://github.com/gin-gonic/gin/pull/4392)).

### 🐛 Bug Fixes

- **Router Panic Fixed:** Resolved a panic in `findCaseInsensitivePathRec` when `RedirectFixedPath` is enabled ([#4535](https://github.com/gin-gonic/gin/pull/4535)).
- **Content-Length in Data Render:** `Data.Render` now correctly writes the `Content-Length` header ([#4206](https://github.com/gin-gonic/gin/pull/4206)).
- **ClientIP with Multiple Headers:** `ClientIP` now correctly handles requests with multiple `X-Forwarded-For` header values ([#4472](https://github.com/gin-gonic/gin/pull/4472)).
- **Binding Edge Cases:** Fixed empty value errors in binding ([#2169](https://github.com/gin-gonic/gin/pull/2169)) and improved empty slice/array handling in form binding ([#4380](https://github.com/gin-gonic/gin/pull/4380)).
- **Literal Colon Routes:** Routes with literal colons now work correctly with `engine.Handler()` ([#4415](https://github.com/gin-gonic/gin/pull/4415)).
- **File Descriptor Leak:** `RunFd` now closes the `os.File` handle properly to prevent resource leaks ([#4422](https://github.com/gin-gonic/gin/pull/4422)).
- **Hijack Behavior:** Refined hijack behavior to correctly model the response lifecycle ([#4373](https://github.com/gin-gonic/gin/pull/4373)).
- **Recovery:** `http.ErrAbortHandler` is now suppressed in the recovery middleware as intended ([#4336](https://github.com/gin-gonic/gin/pull/4336)).
- **Debug Version Mismatch:** Fixed an incorrect version string reported in debug mode ([#4403](https://github.com/gin-gonic/gin/pull/4403)).

### 🔧 Build, Dependency & CI Updates

- **Go 1.25 Minimum:** The minimum supported Go version is now **1.25**, with CI workflows updated accordingly ([#4388](https://github.com/gin-gonic/gin/pull/4388), [#4550](https://github.com/gin-gonic/gin/pull/4550)).
- **BSON Dependency Upgrade:** The BSON binding dependency has been upgraded to `mongo-driver` v2 ([#4549](https://github.com/gin-gonic/gin/pull/4549)).

---

Gin 1.12.0 reflects the dedication of our community — contributors, reviewers, and users alike. Thank you for making Gin better with every release.

Ready to try Gin 1.12.0? [Upgrade on GitHub](https://github.com/gin-gonic/gin/releases/tag/v1.12.0) and let us know what you think!
