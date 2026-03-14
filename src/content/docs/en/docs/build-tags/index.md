---
title: "Build Tags"
sidebar:
  order: 11
---

Gin supports Go build tags to customize the binary at compile time. You can replace the default JSON encoder with a faster alternative, or disable features like MsgPack rendering to reduce binary size.

This section covers:

- Replacing the default JSON encoder with go-json, jsoniter, or sonic
- Disabling MsgPack rendering with the `nomsgpack` build tag
