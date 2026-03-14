---
title: "MsgPackなしでのビルド"
sidebar:
  order: 2
---

[MsgPack](https://msgpack.org/) (MessagePack) is a compact binary serialization format -- think of it as a faster, smaller alternative to JSON. Gin includes MsgPack rendering and binding support by default, which means your application can accept and return MsgPack-encoded data out of the box using `c.Bind()` and `c.Render()` with the appropriate content type.

However, many applications only use JSON and never need MsgPack. In that case, the MsgPack dependency adds unnecessary weight to your compiled binary. You can strip it out with the `nomsgpack` build tag.

## Building without MsgPack

Pass the `nomsgpack` tag to `go build`:

```sh
go build -tags=nomsgpack .
```

This also works with other Go commands:

```sh
go run -tags=nomsgpack .
go test -tags=nomsgpack ./...
```

## What changes

When you build with `nomsgpack`, Gin excludes the MsgPack rendering and binding code at compile time. This has a few practical effects:

- The compiled binary is smaller because the MsgPack serialization library is not linked in.
- Any handler that attempts to render or bind MsgPack data will no longer work. If you use `c.ProtoBuf()` or other non-MsgPack renderers, those are unaffected.
- All JSON, XML, YAML, TOML, and ProtoBuf features continue to work normally.

:::note
If your API does not serve MsgPack responses and you do not call `c.MsgPack()` anywhere, it is safe to use this tag. Your existing JSON and HTML handlers will behave identically.
:::

## Verifying the result

You can confirm the binary size reduction by comparing builds:

```sh
# Standard build
go build -o gin-app .
ls -lh gin-app

# Build without MsgPack
go build -tags=nomsgpack -o gin-app-nomsgpack .
ls -lh gin-app-nomsgpack
```

The exact savings depend on your application, but removing MsgPack typically shaves a small amount off the final binary. For more background, see the [original pull request](https://github.com/gin-gonic/gin/pull/1852).
