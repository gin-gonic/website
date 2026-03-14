---
title: "Announcing Gin 1.11.0: HTTP/3, Form Improvements, Performance & More"
linkTitle: "Gin 1.11.0 Release Announcement"
lastUpdated: 2025-09-21
---

## Gin v1.11.0 Has Arrived

We're excited to announce the release of Gin v1.11.0, bringing a major set of new features, performance tweaks, and bug fixes to the beloved web framework. This release continues Gin's commitment to speed, flexibility, and modern Go development.

### 🌟 Key Features

- **Experimental HTTP/3 Support:** Gin now supports experimental HTTP/3 via [quic-go](https://github.com/quic-go/quic-go)! If you're eager to try the latest web transport protocols, now's your chance. ([#3210](https://github.com/gin-gonic/gin/pull/3210))

- **Better Form Binding:** We've made big improvements to form binding:
  - Support for array collection formats in forms ([#3986](https://github.com/gin-gonic/gin/pull/3986))
  - Custom string slice unmarshalling for form tags ([#3970](https://github.com/gin-gonic/gin/pull/3970))
  - Default values for collections ([#4048](https://github.com/gin-gonic/gin/pull/4048))

- **Enhanced Binding Types:** Bind plain text easily with the new `BindPlain` method ([#3904](https://github.com/gin-gonic/gin/pull/3904)), plus support for unixMilli and unixMicro formats ([#4190](https://github.com/gin-gonic/gin/pull/4190)).

- **Context API Improvements:** `GetXxx` now supports more native Go types ([#3633](https://github.com/gin-gonic/gin/pull/3633)), making type-safe context data retrieval easier.

- **Filesystem Updates:** The new `OnlyFilesFS` is now exported, tested, and documented ([#3939](https://github.com/gin-gonic/gin/pull/3939)).

### 🚀 Performance & Enhancements

- **Faster Form Data Handling:** Internal optimizations for form parsing boost performance ([#4339](https://github.com/gin-gonic/gin/pull/4339)).
- Refactored core, rendering, and context logic for robustness and clarity ([full PR list in changelog](../releases/release111.md)).

### 🐛 Bug Fixes

- **Middleware Reliability:** Fixed a rare bug where middleware could re-enter unexpectedly ([#3987](https://github.com/gin-gonic/gin/pull/3987)).
- Improved TOML form binding stability ([#4193](https://github.com/gin-gonic/gin/pull/4193)).
- No more panics when handling "method not allowed" requests on empty trees ([#4003](https://github.com/gin-gonic/gin/pull/4003)).
- General improvements to context handling, race conditions, and more.

### 🔧 Build, Dependency & CI Updates

- Support for **Go 1.25** in CI/CD workflows, plus new linters enabled for stricter code health ([#4341](https://github.com/gin-gonic/gin/pull/4341), [#4010](https://github.com/gin-gonic/gin/pull/4010)).
- Trivy vulnerability scanning now integrated with CI ([#4359](https://github.com/gin-gonic/gin/pull/4359)).
- Multiple dependency upgrades, including `sonic`, `setup-go`, `quic-go`, and others.

### 📖 Documentation

- Expanded documentation, updated changelogs, improved grammar and code samples, and new Portuguese docs ([#4078](https://github.com/gin-gonic/gin/pull/4078)).

---

Gin 1.11.0 is a testament to our active community and continuous development. We appreciate every contributor, issue reporter, and user who keeps Gin sharp and relevant for modern web applications.

Ready to try Gin 1.11.0? [Upgrade on GitHub](https://github.com/gin-gonic/gin/releases/tag/v1.11.0) and let us know what you think!
