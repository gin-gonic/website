---
title: "Build without MsgPack"
sidebar:
  order: 2
---

Gin enables `MsgPack` rendering feature by default. But you can disable this feature by specifying the `nomsgpack` build tag.

```sh
go build -tags=nomsgpack .
```

This is useful to reduce the binary size of executable files. See the [detail information](https://github.com/gin-gonic/gin/pull/1852).
